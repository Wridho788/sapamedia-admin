-- REQUIRED: Create profile for superadmin@sapamedia.com
-- Run this in your Supabase SQL Editor to fix the missing profile

-- Create profile for superadmin@sapamedia.com
INSERT INTO public.user_profiles (id, full_name, roles, created_at, updated_at)
VALUES (
  '066979c5-97cf-4f1c-85f5-c172830d83fb',
  'Super Admin',
  'super_admin',
  NOW(),
  NOW()
) 
ON CONFLICT (id) 
DO UPDATE SET 
  roles = 'super_admin',
  full_name = 'Super Admin',
  updated_at = NOW();

-- You can also bulk update existing users by email pattern:
UPDATE user_profiles 
SET roles = 'super_admin', full_name = 'Super Admin'
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email LIKE '%superadmin%' OR email LIKE '%admin%'
);

UPDATE user_profiles 
SET roles = 'editor', full_name = 'Editor'
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email LIKE '%editor%'
);

-- Verify the changes
SELECT 
  p.id,
  p.full_name,
  p.roles,
  p.created_at,
  au.email
FROM user_profiles p
JOIN auth.users au ON p.id = au.id
ORDER BY p.roles DESC, au.email;