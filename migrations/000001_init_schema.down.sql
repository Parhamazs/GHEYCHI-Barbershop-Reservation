-- Migration: 000001_init_schema.down.sql
DROP TRIGGER IF EXISTS trg_limit_barber_images ON barber_images;
DROP FUNCTION IF EXISTS enforce_barber_images_limit();
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS daily_schedules;
DROP TABLE IF EXISTS schedule_template_slots;
DROP TABLE IF EXISTS schedule_templates;
DROP TABLE IF EXISTS barber_images;
DROP TABLE IF EXISTS barber_profiles;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS payment_status;
DROP TYPE IF EXISTS appointment_status;
DROP TYPE IF EXISTS user_role;
