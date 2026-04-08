-- Setup Admin User for SapaMedia Admin Panel
-- Run this in your Supabase SQL Editor

-- First, you need to create the user in Supabase Auth Dashboard:
-- 1. Go to Authentication > Users in Supabase Dashboard
-- 2. Click "Add User" > "Create new user"
-- 3. Email: superadmin@sapamedia.com
-- 4. Password: SuperAdmin123
-- 5. Confirm email: Yes (check the box)
-- 6. Copy the user ID that's generated

-- OR use this SQL to find the user ID if already created:
-- SELECT id, email FROM auth.users WHERE email = 'superadmin@sapamedia.com';

-- Then run this SQL with the correct user ID:
-- Replace 'YOUR_USER_ID_HERE' with the actual UUID from Supabase Auth

-- Create or update user profile
INSERT INTO public.user_profiles (id, full_name, roles, is_active, created_at, updated_at)
VALUES (
  'YOUR_USER_ID_HERE',  -- Replace with actual user ID from auth.users
  'Super Admin',
  'admin',              -- Changed from 'super_admin' to 'admin' per Sprint 1
  true,
  NOW(),
  NOW()
) 
ON CONFLICT (id) 
DO UPDATE SET 
  roles = 'admin',
  full_name = 'Super Admin',
  is_active = true,
  updated_at = NOW();

-- Verify the user profile was created
SELECT 
  up.id, 
  up.full_name, 
  up.roles, 
  up.is_active,
  au.email
FROM public.user_profiles up
JOIN auth.users au ON au.id = up.id
WHERE au.email = 'superadmin@sapamedia.com';
