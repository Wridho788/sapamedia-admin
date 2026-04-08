## Login Issue - User Setup Required

The login error `401 Unauthorized - Invalid login credentials` indicates that the user account doesn't exist in Supabase Auth yet.

### Solution Options:

#### **Option 1: Create User via Supabase Dashboard (Recommended)**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/xwgoorlprcrcypsnrknd)
2. Navigate to **Authentication** → **Users**
3. Click **"Add User"** → **"Create new user"**
4. Fill in:
   - Email: `superadmin@sapamedia.com`
   - Password: `SuperAdmin123`
   - Check **"Auto Confirm User"** (important!)
5. Click **"Create User"**
6. Copy the generated User ID (UUID)
7. Go to **SQL Editor** and run:

\`\`\`sql
-- Replace YOUR_USER_ID with the UUID from step 6
INSERT INTO public.user_profiles (id, full_name, roles, is_active, created_at, updated_at)
VALUES (
  'YOUR_USER_ID',
  'Super Admin',
  'admin',
  true,
  NOW(),
  NOW()
);
\`\`\`

#### **Option 2: Use the Register API Endpoint**

I've created a `/api/auth/register` endpoint. Test it using this curl command or Postman:

\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "superadmin@sapamedia.com",
    "password": "SuperAdmin123",
    "full_name": "Super Admin",
    "role": "admin"
  }'
\`\`\`

Or use this in your browser console (while on localhost:3000):

\`\`\`javascript
fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'superadmin@sapamedia.com',
    password: 'SuperAdmin123',
    full_name: 'Super Admin',
    role: 'admin'
  })
})
.then(r => r.json())
.then(console.log)
\`\`\`

#### **Option 3: Run SQL Script**

Run the `setup-admin-user.sql` file I created, but first get the user ID from Supabase Auth.

### After Creating the User

Try logging in again with:
- Email: `superadmin@sapamedia.com`
- Password: `SuperAdmin123`

### Security Note

⚠️ **Important**: The `/api/auth/register` endpoint should be protected or removed in production! Currently it's open for development purposes only.
