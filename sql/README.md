# Nexio24 Supabase SQL Migration Guide

Run these SQL scripts in your **Supabase Dashboard** ➔ **SQL Editor** in the following order:

---

### Step 1: Run `01_auth_and_profiles.sql`
- **What it does**: 
  - Creates the `public.profiles` table linked to Supabase `auth.users`.
  - Configures user roles (`admin`, `staff`, `customer`).
  - Sets up an automated **Database Trigger** (`on_auth_user_created`) so whenever any user signs up (via Customer Portal or Admin Login), their profile row is created automatically with complete privacy!
  - Sets Row Level Security (RLS) so customers cannot see other customers' profiles.

---

### Step 2: Run `02_tickets_and_operations.sql`
- **What it does**:
  - Enables the `vector` extension for AI RAG embeddings.
  - Creates `tickets`, `messages`, `agent_runs`, `tool_calls`, `approvals`, `knowledge_documents`, `knowledge_chunks`, and `audit_logs`.
  - Implements strict RLS data isolation: customers can only query their own tickets, while admins have full operational overview.

---

### Step 3: Run `03_seed_data.sql`
- **What it does**:
  - Populates initial hotel knowledge documents (FAQs, Booking Policy, HVAC Guide).
  - Populates initial operational demo tickets (`TICK-1245` AC issue, `TICK-1244` booking modification, etc.).

---

### Step 4: Run `04_create_admin_user.sql`
- After you sign up with your email (e.g. `hadia@nexio24.com`), run this query to set your role to `'admin'`.

