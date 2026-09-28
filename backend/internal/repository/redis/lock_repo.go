package redis

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

var (
	ErrLockAlreadyHeld = errors.New("slot is temporarily locked by another user")
	ErrLockNotFound    = errors.New("lock does not exist or has expired")
)

const (
	SlotLockDuration = 15 * time.Minute // 15-minute temporary hold window
	SlotLockKeyPrefix = "gheychi:lock:slot:"
)

type LockRepository interface {
	AcquireSlotLock(ctx context.Context, slotID string, customerID string) (bool, error)
	ReleaseSlotLock(ctx context.Context, slotID string, customerID string) error
	GetLockOwner(ctx context.Context, slotID string) (string, time.Duration, error)
	ExtendLock(ctx context.Context, slotID string, customerID string, duration time.Duration) error
}

type RedisLockRepo struct {
	client *redis.Client
}

func NewRedisLockRepo(client *redis.Client) *RedisLockRepo {
	return &RedisLockRepo{client: client}
}

// AcquireSlotLock attempts an atomic SET NX EX with 15-minute TTL
func (r *RedisLockRepo) AcquireSlotLock(ctx context.Context, slotID string, customerID string) (bool, error) {
	key := fmt.Sprintf("%s%s", SlotLockKeyPrefix, slotID)
	// SETNX with 15 min TTL
	success, err := r.client.SetNX(ctx, key, customerID, SlotLockDuration).Result()
	if err != nil {
		return false, fmt.Errorf("failed to execute Redis SETNX: %w", err)
	}
	return success, nil
}

// ReleaseSlotLock atomically releases the lock only if held by customerID (Lua script)
func (r *RedisLockRepo) ReleaseSlotLock(ctx context.Context, slotID string, customerID string) error {
	key := fmt.Sprintf("%s%s", SlotLockKeyPrefix, slotID)
	luaScript := `
		if redis.call("get", KEYS[1]) == ARGV[1] then
			return redis.call("del", KEYS[1])
		else
			return 0
		end
	`
	res, err := r.client.Eval(ctx, luaScript, []string{key}, customerID).Result()
	if err != nil {
		return fmt.Errorf("failed to evaluate release lock script: %w", err)
	}
	if res.(int64) == 0 {
		return ErrLockNotFound
	}
	return nil
}

// GetLockOwner returns the owner customerID and remaining TTL
func (r *RedisLockRepo) GetLockOwner(ctx context.Context, slotID string) (string, time.Duration, error) {
	key := fmt.Sprintf("%s%s", SlotLockKeyPrefix, slotID)
	owner, err := r.client.Get(ctx, key).Result()
	if errors.Is(err, redis.Nil) {
		return "", 0, ErrLockNotFound
	}
	if err != nil {
		return "", 0, err
	}
	ttl, err := r.client.TTL(ctx, key).Result()
	if err != nil {
		return owner, 0, err
	}
	return owner, ttl, nil
}

// ExtendLock extends TTL if held by customerID
func (r *RedisLockRepo) ExtendLock(ctx context.Context, slotID string, customerID string, duration time.Duration) error {
	key := fmt.Sprintf("%s%s", SlotLockKeyPrefix, slotID)
	luaScript := `
		if redis.call("get", KEYS[1]) == ARGV[1] then
			return redis.call("expire", KEYS[1], ARGV[2])
		else
			return 0
		end
	`
	res, err := r.client.Eval(ctx, luaScript, []string{key}, customerID, int(duration.Seconds())).Result()
	if err != nil {
		return err
	}
	if res.(int64) == 0 {
		return ErrLockNotFound
	}
	return nil
}
