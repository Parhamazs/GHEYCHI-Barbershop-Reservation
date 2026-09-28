-- Seed Data for Gheychi (قیچی)
-- Default passwords hashed with bcrypt (cost 10) for "password123": $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- 1. Users (Barbers & Customers)
INSERT INTO users (id, email, password_hash, full_name, phone, role) VALUES
('b1000000-0000-0000-0000-000000000001', 'barber.kaveh@gheychi.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Kaveh Radmanesh', '+989121112233', 'barber'),
('b1000000-0000-0000-0000-000000000002', 'barber.reza@gheychi.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Reza Tehrani', '+989123334455', 'barber'),
('b1000000-0000-0000-0000-000000000003', 'barber.ali@gheychi.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ali Rostami', '+989125556677', 'barber'),
('c1000000-0000-0000-0000-000000000001', 'customer.arash@gheychi.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Arash Davoudi', '+989351112233', 'customer'),
('c1000000-0000-0000-0000-000000000002', 'customer.sara@gheychi.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sara Moradi', '+989357778899', 'customer');

-- 2. Barber Profiles
INSERT INTO barber_profiles (id, user_id, shop_name, bio, phone_number, address, latitude, longitude, working_hours_start, working_hours_end, slot_duration_minutes, price_per_slot, services) VALUES
('bp000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Gheychi Artisanal Studio', 'Master barber with 12 years of experience in precision fades, hot towel straight razor shaves, and beard grooming. Cozy ambiance with complimentary specialty coffee.', '+982122001122', 'Jordan St., Golazin Alley, No. 14, Tehran', 35.7820, 51.4230, '09:00:00', '21:00:00', 30, 30.00, '["Master Fade", "Beard Sculpting", "Hot Towel Shave", "Keratin Treatment"]'::jsonb),
('bp000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'Classic Blade Barberia', 'Traditional barbershop specialized in vintage gentleman cuts, royal beard care, and modern styling. Walk-in and online reservations welcome.', '+982188776655', 'Valiasr Ave., Above Vanak Sq., No. 240, Tehran', 35.7615, 51.4110, '10:00:00', '20:00:00', 30, 25.00, '["Classic Haircut", "Beard Trim", "Head Massage", "Hair Coloring"]'::jsonb),
('bp000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', 'Urban Fade Lounge', 'Contemporary high-energy styling parlor. Precision razor tapers, textured crops, and personalized hair care consultations.', '+982122668899', 'Elahiyeh, Maryam St., Commercial Center B2, Tehran', 35.7950, 51.4280, '09:30:00', '21:30:00', 30, 35.00, '["Textured Crop", "Skin Fade", "Beard Detail", "Facial Mask"]'::jsonb);

-- 3. Barber Images (Max 4 images per profile)
INSERT INTO barber_images (id, barber_profile_id, image_url, caption, display_order) VALUES
('img00000-0000-0000-0000-000000000001', 'bp000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80', 'Main styling hall with hydraulic leather chairs', 1),
('img00000-0000-0000-0000-000000000002', 'bp000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80', 'Master barber at work with precision shears', 2),
('img00000-0000-0000-0000-000000000003', 'bp000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80', 'Artisanal tools station and organic pomades', 3),
('img00000-0000-0000-0000-000000000004', 'bp000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80', 'Espresso bar and waiting lounge', 4),

('img00000-0000-0000-0000-000000000005', 'bp000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=800&q=80', 'Vintage station mirrors and warm lighting', 1),
('img00000-0000-0000-0000-000000000006', 'bp000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80', 'Straight razor shave and hot towel service', 2),

('img00000-0000-0000-0000-000000000007', 'bp000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1534778310322-a9b0d2d3a339?w=800&q=80', 'Modern urban salon interior', 1),
('img00000-0000-0000-0000-000000000008', 'bp000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1517832606589-7629c339590a?w=800&q=80', 'Styling chairs and wash stations', 2);

-- 4. Reusable Schedule Templates
INSERT INTO schedule_templates (id, barber_profile_id, name, is_default) VALUES
('st000000-0000-0000-0000-000000000001', 'bp000000-0000-0000-0000-000000000001', 'Standard Full Day (9:00 - 18:00)', true);

INSERT INTO schedule_template_slots (template_id, start_time, end_time) VALUES
('st000000-0000-0000-0000-000000000001', '09:00:00', '09:30:00'),
('st000000-0000-0000-0000-000000000001', '09:30:00', '10:00:00'),
('st000000-0000-0000-0000-000000000001', '10:00:00', '10:30:00'),
('st000000-0000-0000-0000-000000000001', '10:30:00', '11:00:00'),
('st000000-0000-0000-0000-000000000001', '11:00:00', '11:30:00'),
('st000000-0000-0000-0000-000000000001', '11:30:00', '12:00:00'),
('st000000-0000-0000-0000-000000000001', '14:00:00', '14:30:00'),
('st000000-0000-0000-0000-000000000001', '14:30:00', '15:00:00'),
('st000000-0000-0000-0000-000000000001', '15:00:00', '15:30:00'),
('st000000-0000-0000-0000-000000000001', '15:30:00', '16:00:00'),
('st000000-0000-0000-0000-000000000001', '16:00:00', '16:30:00'),
('st000000-0000-0000-0000-000000000001', '16:30:00', '17:00:00'),
('st000000-0000-0000-0000-000000000001', '17:00:00', '17:30:00'),
('st000000-0000-0000-0000-000000000001', '17:30:00', '18:00:00');

-- 5. Appointments for Today and Tomorrow (Next 2 Days)
-- Current Date: CURRENT_DATE
INSERT INTO appointments (barber_profile_id, slot_date, start_time, end_time, status, service_name, price, customer_id, manual_notes) VALUES
-- Today's slots
('bp000000-0000-0000-0000-000000000001', CURRENT_DATE, '09:00:00', '09:30:00', 'reserved_paid', 'Master Fade', 30.00, 'c1000000-0000-0000-0000-000000000001', NULL),
('bp000000-0000-0000-0000-000000000001', CURRENT_DATE, '09:30:00', '10:00:00', 'reserved_manual', 'Beard Trim & Clean', 25.00, NULL, 'Booked via phone: Farhad (+989129990011)'),
('bp000000-0000-0000-0000-000000000001', CURRENT_DATE, '10:00:00', '10:30:00', 'available', 'Standard Haircut', 30.00, NULL, NULL),
('bp000000-0000-0000-0000-000000000001', CURRENT_DATE, '10:30:00', '11:00:00', 'available', 'Standard Haircut', 30.00, NULL, NULL),
('bp000000-0000-0000-0000-000000000001', CURRENT_DATE, '11:00:00', '11:30:00', 'reserved_paid', 'Hot Towel Shave', 30.00, 'c1000000-0000-0000-0000-000000000002', NULL),
('bp000000-0000-0000-0000-000000000001', CURRENT_DATE, '11:30:00', '12:00:00', 'available', 'Standard Haircut', 30.00, NULL, NULL),
('bp000000-0000-0000-0000-000000000001', CURRENT_DATE, '14:00:00', '14:30:00', 'available', 'Standard Haircut', 30.00, NULL, NULL),
('bp000000-0000-0000-0000-000000000001', CURRENT_DATE, '14:30:00', '15:00:00', 'reserved_manual', 'Quick Styling', 20.00, NULL, 'Walk-in regular customer'),
('bp000000-0000-0000-0000-000000000001', CURRENT_DATE, '15:00:00', '15:30:00', 'available', 'Standard Haircut', 30.00, NULL, NULL),
('bp000000-0000-0000-0000-000000000001', CURRENT_DATE, '15:30:00', '16:00:00', 'available', 'Standard Haircut', 30.00, NULL, NULL),

-- Tomorrow's slots (CURRENT_DATE + 1)
('bp000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '1 day', '09:00:00', '09:30:00', 'available', 'Standard Haircut', 30.00, NULL, NULL),
('bp000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '1 day', '09:30:00', '10:00:00', 'reserved_paid', 'Master Fade', 30.00, 'c1000000-0000-0000-0000-000000000001', NULL),
('bp000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '1 day', '10:00:00', '10:30:00', 'available', 'Standard Haircut', 30.00, NULL, NULL),
('bp000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '1 day', '10:30:00', '11:00:00', 'reserved_manual', 'Beard Trim', 25.00, NULL, 'Phone booking: Kamran'),
('bp000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '1 day', '11:00:00', '11:30:00', 'available', 'Standard Haircut', 30.00, NULL, NULL),
('bp000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '1 day', '11:30:00', '12:00:00', 'available', 'Standard Haircut', 30.00, NULL, NULL);

-- 6. Reviews
INSERT INTO reviews (barber_profile_id, customer_id, rating, comment) VALUES
('bp000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 5, 'Kaveh is an absolute master. The taper fade was flawless, and the booking system made reserving a morning slot effortless!'),
('bp000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', 5, 'Clean studio, punctual start time, and great espresso. Best beard trim in Jordan area.'),
('bp000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 4, 'Very classic vibe and great straight razor service. Highly recommend Reza.');
