-- Migration: 000001_init_schema.up.sql
-- Gheychi (قیچی) PostgreSQL Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types for users and booking statuses
CREATE TYPE user_role AS ENUM ('barber', 'customer', 'admin');
CREATE TYPE appointment_status AS ENUM ('available', 'pending_payment', 'reserved_paid', 'reserved_manual', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Barber Profiles table
CREATE TABLE barber_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    shop_name VARCHAR(200) NOT NULL,
    bio TEXT,
    phone_number VARCHAR(30) NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    working_hours_start TIME NOT NULL DEFAULT '09:00:00',
    working_hours_end TIME NOT NULL DEFAULT '21:00:00',
    slot_duration_minutes INT NOT NULL DEFAULT 30,
    price_per_slot NUMERIC(10, 2) NOT NULL DEFAULT 25.00,
    services JSONB DEFAULT '["Haircut", "Beard Trim", "Hair Styling", "Face Scrub"]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Barber Gallery Images (Enforcing Max 4 images via application & trigger)
CREATE TABLE barber_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barber_profile_id UUID NOT NULL REFERENCES barber_profiles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Schedule Templates (Reusable daily templates created by barbers)
CREATE TABLE schedule_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barber_profile_id UUID NOT NULL REFERENCES barber_profiles(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Schedule Template Slots (Time slots belonging to a template)
CREATE TABLE schedule_template_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES schedule_templates(id) ON DELETE CASCADE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_slot_time_order CHECK (end_time > start_time)
);

-- Daily Schedules (Instantiated schedule for a specific date)
CREATE TABLE daily_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barber_profile_id UUID NOT NULL REFERENCES barber_profiles(id) ON DELETE CASCADE,
    template_id UUID REFERENCES schedule_templates(id) ON DELETE SET NULL,
    schedule_date DATE NOT NULL,
    is_day_off BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_barber_date UNIQUE (barber_profile_id, schedule_date)
);

-- Appointments / Time Slots Table
-- Statuses:
-- 'available' (White in UI)
-- 'reserved_paid' (Green in UI)
-- 'reserved_manual' (Yellow in UI - phone/in-person booking)
-- 'pending_payment' (Temporary hold, locked in Redis)
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barber_profile_id UUID NOT NULL REFERENCES barber_profiles(id) ON DELETE CASCADE,
    daily_schedule_id UUID REFERENCES daily_schedules(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status appointment_status NOT NULL DEFAULT 'available',
    manual_notes VARCHAR(255), -- for phone/in-person customer details
    service_name VARCHAR(100) DEFAULT 'Standard Haircut',
    price NUMERIC(10, 2) NOT NULL DEFAULT 25.00,
    lock_expires_at TIMESTAMP WITH TIME ZONE, -- sync with Redis TTL
    reserved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_appointment_time CHECK (end_time > start_time),
    CONSTRAINT uq_barber_slot UNIQUE (barber_profile_id, slot_date, start_time)
);

-- Payments / Transactions table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    status payment_status NOT NULL DEFAULT 'pending',
    transaction_ref VARCHAR(100),
    payment_method VARCHAR(50) DEFAULT 'credit_card',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comments / Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barber_profile_id UUID NOT NULL REFERENCES barber_profiles(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger: Limit Barber Images to maximum 4
CREATE OR REPLACE FUNCTION enforce_barber_images_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM barber_images WHERE barber_profile_id = NEW.barber_profile_id) >= 4 THEN
        RAISE EXCEPTION 'A barber cannot have more than 4 gallery images';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_limit_barber_images
BEFORE INSERT ON barber_images
FOR EACH ROW EXECUTE FUNCTION enforce_barber_images_limit();

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_barber_profiles_location ON barber_profiles(latitude, longitude);
CREATE INDEX idx_barber_images_profile ON barber_images(barber_profile_id);
CREATE INDEX idx_appointments_date_barber ON appointments(barber_profile_id, slot_date, status);
CREATE INDEX idx_appointments_customer ON appointments(customer_id);
CREATE INDEX idx_daily_schedules_barber_date ON daily_schedules(barber_profile_id, schedule_date);
CREATE INDEX idx_reviews_barber ON reviews(barber_profile_id);
CREATE INDEX idx_payments_appointment ON payments(appointment_id);
