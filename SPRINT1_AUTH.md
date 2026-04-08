# SapaMedia Admin Authentication Setup

## Sprint 1 - Authentication & Role-Based Access 🔒

This implementation includes:
- ✅ Supabase authentication
- ✅ Role-based access control (SUPER_ADMIN, EDITOR, WRITER)
- ✅ Protected admin routes
- ✅ Session persistence with Zustand
- ✅ Middleware for route protection
- ✅ Role-based sidebar navigation

## ✅ FIXED: Simplified Authentication Flow

**NEW BEHAVIOR:**
- Any user who can authenticate with Supabase Auth can access the admin panel
- If user doesn't have a profile, system automatically creates one with default 'writer' role
- Role determines which menu items are visible, but doesn't block admin access
- Much simpler and more user-friendly!

**No manual SQL fixes needed anymore** - the system handles missing profiles automatically.

## Setup Instructions

### 1. Database Setup (Supabase)

Create the following table in your Supabase database:

```sql
-- Create user_profiles table (matching your current Supabase schema)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  roles TEXT CHECK (roles IN ('super_admin', 'editor', 'writer')) DEFAULT 'writer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, roles)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    'writer'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 1.1. Fix Existing Users Without Profiles

If you have existing users in auth.users without profiles, run this:

```sql
-- Create user_profiles for existing auth users who don't have profiles
INSERT INTO public.user_profiles (id, full_name, roles)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', 'User') as full_name,
  CASE 
    WHEN au.email LIKE '%superadmin%' OR au.email LIKE '%admin%' THEN 'super_admin'
    WHEN au.email LIKE '%editor%' THEN 'editor'
    ELSE 'writer'
  END as roles
FROM auth.users au
LEFT JOIN public.user_profiles p ON au.id = p.id
WHERE p.id IS NULL;
```

### 2. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Create Test Users

In Supabase Auth dashboard, create test users and manually insert their profiles:

```sql
-- Insert admin user profile
INSERT INTO user_profiles (id, full_name, roles)
VALUES ('user-uuid-from-auth', 'Admin User', 'super_admin');

-- Insert editor user profile  
INSERT INTO user_profiles (id, full_name, roles)
VALUES ('user-uuid-from-auth', 'Editor User', 'editor');

-- Insert writer user profile
INSERT INTO user_profiles (id, full_name, roles)  
VALUES ('user-uuid-from-auth', 'Writer User', 'writer');
```

### 4. Role Permissions

| Role | Dashboard | Articles | Categories | Media | Users | Settings |
|------|-----------|----------|------------|-------|-------|----------|
| WRITER | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| EDITOR | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| SUPER_ADMIN | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### 5. Run the Application

```bash
npm run dev
```

Navigate to `http://localhost:3000` and login with your test credentials.

## Key Features Implemented

### Authentication Flow
1. **Login**: User logs in with email/password through Supabase Auth
2. **Get Role**: System queries `user_profiles.roles` to get user role (NOT from auth metadata)
3. **Profile Creation**: If no profile exists → automatically creates one with default 'writer' role
4. **Store State**: Role from `user_profiles.roles` + user data stored in Zustand with persistence
5. **Route Protection**: Middleware checks authentication + verifies profile exists
6. **Refresh Handling**: On page refresh → `refreshUserProfile()` restores role from database

### Role-Based Access Control System

#### **Permission Helpers Available:**
```typescript
// In components
const {
  currentRole,           // 'writer' | 'editor' | 'super_admin'
  isWriter,             // boolean
  isEditor,             // boolean (editor OR super_admin)  
  isSuperAdmin,         // boolean
  canManageArticles,    // boolean
  canDeleteArticles,    // boolean
  canManageCategories,  // boolean
  canManageUsers,       // boolean
  hasRole,              // function: hasRole('editor')
  canAccess             // function: canAccess('articles:delete')
} = usePermissions()
```

#### **Component Protection:**
```typescript
// Role-based component protection
<RoleGuard requiredRole="editor">
  <CategoryManager />
</RoleGuard>

// Feature-based protection
<FeatureGuard feature="articles:delete">
  <DeleteButton />
</FeatureGuard>
```

#### **Page-level Protection:**
```typescript
// HOC for entire pages
export default withRoleProtection(UsersPage, 'super_admin')
```

### Route Protection
- `/admin/*` requires authentication only
- Middleware redirects unauthenticated users to `/auth/login`
- All authenticated users can access admin (role determines UI features)

### Role-Based UI
- Sidebar shows only permitted menu items based on user role
- User info displayed in sidebar with role badge
- Proper logout functionality

### State Management
- Zustand store handles auth state
- Persistent storage for session management
- Automatic auth check on app initialization

## Next Steps (Sprint 2)

- Implement article CRUD operations
- Add category management
- Create media upload functionality
- Implement user management (for super_admin)
- Add settings page
- Implement forgot password flow