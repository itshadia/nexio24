-- ==============================================================================
-- 04_create_admin_user.sql
-- Run this in Supabase SQL Editor to Seed Admin User and Profile
-- ==============================================================================
-- Admin Credentials:
--   Email:    admin@nexio24.com
--   Password: Admin@123456
--   Role:     admin
-- ==============================================================================

-- 1. Enable pgcrypto for standard bcrypt password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Cleanly insert or update admin user in auth.users and public.profiles
DO $$
DECLARE
  new_admin_id UUID := gen_random_uuid();
  admin_email TEXT := 'admin@nexio24.com';
  admin_password TEXT := 'Admin@123456';
  admin_name TEXT := 'Hadia Asghar';
BEGIN
  -- If user does not exist in auth.users, create it
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
      recovery_token,
      email_change_token_new,
      email_change,
      email_change_token_current,
      phone_change,
      phone_change_token,
      reauthentication_token,
      email_change_confirm_status,
      is_sso_user,
      is_anonymous
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_admin_id,
      'authenticated',
      'authenticated',
      admin_email,
      crypt(admin_password, gen_salt('bf', 10)),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      json_build_object('name', admin_name, 'role', 'admin'),
      now(),
      now(),
      '',
      ''
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      0,
      false,
      false
    );

    -- Ensure identity exists in auth.identities
    BEGIN
      INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
      ) VALUES (
        new_admin_id::text,
        new_admin_id,
        json_build_object('sub', new_admin_id::text, 'email', admin_email)::jsonb,
        'email',
        new_admin_id::text,
        now(),
        now(),
        now()
      );
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;

    -- Ensure row exists in public.profiles
    INSERT INTO public.profiles (id, name, email, role)
    VALUES (new_admin_id, admin_name, admin_email, 'admin')
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin', name = admin_name;

  ELSE
    -- If user already exists in auth.users, update password and sync profile
    SELECT id INTO new_admin_id FROM auth.users WHERE email = admin_email;

    UPDATE auth.users
    SET encrypted_password = crypt(admin_password, gen_salt('bf', 10)),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        confirmed_at = COALESCE(confirmed_at, email_confirmed_at, now()),
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
        raw_user_meta_data = json_build_object('name', admin_name, 'role', 'admin'),
        updated_at = now()
    WHERE id = new_admin_id;

    BEGIN
      INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
      ) VALUES (
        new_admin_id::text,
        new_admin_id,
        json_build_object('sub', new_admin_id::text, 'email', admin_email)::jsonb,
        'email',
        new_admin_id::text,
        now(),
        now(),
        now()
      ) ON CONFLICT DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;

    INSERT INTO public.profiles (id, name, email, role)
    VALUES (new_admin_id, admin_name, admin_email, 'admin')
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin', name = admin_name;
  END IF;
END $$;

-- 3. Verify that the profiles table has the Admin:
SELECT id, name, email, role, created_at FROM public.profiles;