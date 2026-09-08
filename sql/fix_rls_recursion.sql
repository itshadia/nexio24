-- ==============================================================================
-- fix_rls_recursion.sql
-- Fix Infinite Recursion in public.profiles Row Level Security
-- ==============================================================================

-- 1. Drop the recursive policies on profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
-- 1. Drop all existing policies on profiles cleanly
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.profiles CASCADE;
DROP POLICY IF EXISTS "Allow profile insert" ON public.profiles CASCADE;

-- 2. Create clean, non-recursive policies
-- Allow all authenticated users to read profiles (prevents infinite loop recursion)
CREATE POLICY "Authenticated users can read profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Allow users to update only their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Allow new user profile creation
CREATE POLICY "Allow profile insert"
ON public.profiles FOR INSERT
TO authenticated, service_role
WITH CHECK (true);

-- 3. Verify profiles table query works without recursion error:
SELECT id, name, email, role FROM public.profiles;

