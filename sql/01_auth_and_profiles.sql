-- ==============================================================================
-- 01_auth_and_profiles.sql
-- Setup public.profiles table, Roles (Admin vs Customer), RLS, and Auth Trigger
-- ==============================================================================

-- 1. Create Profiles Table linked to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'staff', 'customer')) DEFAULT 'customer',
  room TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Non-Recursive RLS Policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile insert" ON public.profiles;

-- Allow all authenticated users to read profiles (zero recursion)
CREATE POLICY "Authenticated users can read profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Allow users to update only their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Allow profile creation
CREATE POLICY "Allow profile insert"
ON public.profiles FOR INSERT
TO authenticated, service_role
WITH CHECK (true);

-- 4. Automated Trigger Function:
-- When a user signs up via Supabase Auth (Client or Admin API), this trigger
-- automatically creates their corresponding row in public.profiles.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, room, phone, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    NEW.raw_user_meta_data->>'room',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, public.profiles.name),
    email = EXCLUDED.email,
    role = COALESCE(EXCLUDED.role, public.profiles.role),
    room = COALESCE(EXCLUDED.room, public.profiles.room),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attach Trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
