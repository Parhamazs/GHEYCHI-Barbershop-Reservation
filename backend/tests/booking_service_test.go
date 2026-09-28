package tests

import (
	"context"
	"testing"
	"time"

	"github.com/gheychi/backend/internal/repository/redis"
)

// MockLockRepo simulates Redis atomic behavior in tests
type MockLockRepo struct {
	locks map[string]string
	ttls  map[string]time.Duration
}

func NewMockLockRepo() *MockLockRepo {
	return &MockLockRepo{
		locks: make(map[string]string),
		ttls:  make(map[string]time.Duration),
	}
}

func (m *MockLockRepo) AcquireSlotLock(ctx context.Context, slotID string, customerID string) (bool, error) {
	if _, exists := m.locks[slotID]; exists {
		return false, nil // Already locked
	}
	m.locks[slotID] = customerID
	m.ttls[slotID] = redis.SlotLockDuration
	return true, nil
}

func (m *MockLockRepo) ReleaseSlotLock(ctx context.Context, slotID string, customerID string) error {
	owner, exists := m.locks[slotID]
	if !exists || owner != customerID {
		return redis.ErrLockNotFound
	}
	delete(m.locks, slotID)
	delete(m.ttls, slotID)
	return nil
}

func (m *MockLockRepo) GetLockOwner(ctx context.Context, slotID string) (string, time.Duration, error) {
	owner, exists := m.locks[slotID]
	if !exists {
		return "", 0, redis.ErrLockNotFound
	}
	return owner, m.ttls[slotID], nil
}

func (m *MockLockRepo) ExtendLock(ctx context.Context, slotID string, customerID string, duration time.Duration) error {
	owner, exists := m.locks[slotID]
	if !exists || owner != customerID {
		return redis.ErrLockNotFound
	}
	m.ttls[slotID] = duration
	return nil
}

func TestRedisLockConcurrency(t *testing.T) {
	mockLock := NewMockLockRepo()
	ctx := context.Background()

	slotID := "slot-uuid-101"
	customerA := "customer-1"
	customerB := "customer-2"

	// 1. Customer A locks slot
	acquired, err := mockLock.AcquireSlotLock(ctx, slotID, customerA)
	if err != nil || !acquired {
		t.Fatalf("expected Customer A to acquire lock, got acquired=%v, err=%v", acquired, err)
	}

	// 2. Customer B attempts to lock same slot -> MUST FAIL (double-booking protection)
	acquiredB, err := mockLock.AcquireSlotLock(ctx, slotID, customerB)
	if err != nil {
		t.Fatalf("unexpected error on second lock attempt: %v", err)
	}
	if acquiredB {
		t.Fatalf("expected Customer B to be rejected for locked slot, but acquired was true!")
	}

	// 3. Customer A releases lock (payment confirmed or cancelled)
	err = mockLock.ReleaseSlotLock(ctx, slotID, customerA)
	if err != nil {
		t.Fatalf("expected Customer A to release lock successfully: %v", err)
	}

	// 4. Now Customer B should be able to acquire lock
	acquiredB2, err := mockLock.AcquireSlotLock(ctx, slotID, customerB)
	if err != nil || !acquiredB2 {
		t.Fatalf("expected Customer B to acquire released lock, got %v, err=%v", acquiredB2, err)
	}
}

func TestRedisLockExpirationCheck(t *testing.T) {
	mockLock := NewMockLockRepo()
	ctx := context.Background()

	slotID := "slot-uuid-102"
	customerA := "customer-1"

	acquired, _ := mockLock.AcquireSlotLock(ctx, slotID, customerA)
	if !acquired {
		t.Fatal("failed to acquire initial lock")
	}

	owner, ttl, err := mockLock.GetLockOwner(ctx, slotID)
	if err != nil || owner != customerA {
		t.Fatalf("expected owner %s, got %s", customerA, owner)
	}
	if ttl != 15*time.Minute {
		t.Fatalf("expected 15 min TTL, got %v", ttl)
	}
}
