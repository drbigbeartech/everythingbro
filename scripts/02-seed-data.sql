-- Insert sample users
INSERT INTO users (name, email, role, phone) VALUES
('John Doe', 'john@example.com', 'customer', '+1234567890'),
('Jane Smith', 'jane@example.com', 'seller', '+1234567891'),
('Mike Wilson', 'mike@example.com', 'service_provider', '+1234567892'),
('Sarah Johnson', 'sarah@example.com', 'customer', '+1234567893');

-- Insert sample products
INSERT INTO products (user_id, name, description, price, stock, category, image_url) VALUES
((SELECT id FROM users WHERE email = 'jane@example.com'), 'Fresh Tomatoes', 'Locally grown organic tomatoes', 3.99, 50, 'Vegetables', '/placeholder.svg?height=200&width=200'),
((SELECT id FROM users WHERE email = 'jane@example.com'), 'Whole Wheat Bread', 'Freshly baked whole wheat bread', 2.50, 20, 'Bakery', '/placeholder.svg?height=200&width=200'),
((SELECT id FROM users WHERE email = 'jane@example.com'), 'Farm Fresh Eggs', 'Free-range chicken eggs (dozen)', 4.99, 30, 'Dairy', '/placeholder.svg?height=200&width=200'),
((SELECT id FROM users WHERE email = 'jane@example.com'), 'Local Honey', 'Pure wildflower honey', 8.99, 15, 'Pantry', '/placeholder.svg?height=200&width=200');

-- Insert sample services
INSERT INTO services (user_id, title, description, phone, category, price_range, availability) VALUES
((SELECT id FROM users WHERE email = 'mike@example.com'), 'Electrical Repairs', 'Professional electrical repair and installation services', '+1234567892', 'Home Services', '$50-150', 'Mon-Sat 9AM-6PM'),
((SELECT id FROM users WHERE email = 'mike@example.com'), 'Plumbing Services', 'Emergency plumbing repairs and maintenance', '+1234567892', 'Home Services', '$40-120', '24/7 Available'),
((SELECT id FROM users WHERE email = 'jane@example.com'), 'House Cleaning', 'Professional house cleaning services', '+1234567891', 'Cleaning', '$30-80', 'Mon-Fri 8AM-5PM'),
((SELECT id FROM users WHERE email = 'jane@example.com'), 'Tutoring Services', 'Math and Science tutoring for students', '+1234567891', 'Education', '$25-50/hour', 'Evenings & Weekends');
