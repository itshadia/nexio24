-- ==============================================================================
-- fix_all_admin_auth.sql
-- Run this in Supabase Dashboard -> SQL Editor (Click RUN)
-- 
-- Fixes:
-- 1. ERROR 42710 (policy already exists) by dropping previous policies cleanly
-- 2. "Database error querying schema" (500) by repairing NULL columns in auth.users
-- 3. Ensures an auth.identities entry exists for email authentication
-- 4. Ensures public.profiles role is 'admin'
-- ==============================================================================

-- 1. Drop existing policies cleanly (Prevents "policy already exists" error 42710)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Allow profile insert" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles CASCADE;

-- 2. Create clean, non-recursive policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Allow profile insert"
ON public.profiles FOR INSERT
TO authenticated, service_role
WITH CHECK (true);

-- 3. Fix NULL string columns in auth.users (Fixes "Database error querying schema" / Go scan error)
UPDATE auth.users
SET 
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change = COALESCE(email_change, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  phone_change = COALESCE(phone_change, ''),
  phone_change_token = COALESCE(phone_change_token, ''),
  reauthentication_token = COALESCE(reauthentication_token, ''),
  email_change_confirm_status = COALESCE(email_change_confirm_status, 0),
  is_sso_user = COALESCE(is_sso_user, false),
  is_anonymous = COALESCE(is_anonymous, false),
  confirmed_at = COALESCE(confirmed_at, email_confirmed_at, now())
WHERE email = 'admin@nexio24.com';

-- 4. Add identity row in auth.identities if missing (GoTrue requirement)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'identities') THEN
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    )
    SELECT 
      id::text,
      id,
      json_build_object('sub', id::text, 'email', email)::jsonb,
      'email',
      id::text,
      now(),
      now(),
      now()
    FROM auth.users
    WHERE email = 'admin@nexio24.com'
    ON CONFLICT DO NOTHING;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

-- 5. Set Admin role and details in public.profiles
UPDATE public.profiles
SET 
  role = 'admin',
  name = 'Hadia Asghar'
WHERE email = 'admin@nexio24.com';

-- 6. Verify output:
SELECT id, email, role, name FROM public.profiles WHERE email = 'admin@nexio24.com';
