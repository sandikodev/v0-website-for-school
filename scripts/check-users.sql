-- Check if users table exists and show structure
SELECT sql FROM sqlite_master WHERE type='table' AND name='users';

-- Check if admin user exists
SELECT * FROM users WHERE username = 'admin';

