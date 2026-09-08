-- ==============================================================================
-- NEXIO24 SUPABASE DATABASE SCHEMA
-- AI Operations Hub + Tickets + Multi-Agent + RAG + Audit Logs
-- ==============================================================================

-- 1. Enable pgvector extension for RAG embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'agent', -- 'admin', 'supervisor', 'agent', 'customer'
  organization_id TEXT DEFAULT 'nexio-default',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL, -- e.g. 'TICK-1245'
  channel TEXT NOT NULL DEFAULT 'chat', -- 'chat', 'email', 'webhook', 'voice', 'whatsapp'
  external_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_room TEXT,
  subject TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general', -- 'order', 'refund', 'technical', 'booking', 'maintenance', 'general'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'escalated'
  assigned_to UUID REFERENCES profiles(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
  direction TEXT NOT NULL, -- 'inbound', 'outbound', 'internal'
  sender TEXT NOT NULL, -- 'customer', 'ai_agent', 'staff'
  sender_name TEXT,
  body TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Agent Runs Table (Telemetry, Latency, Token Usage)
CREATE TABLE IF NOT EXISTS agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL, -- 'triage', 'booking', 'maintenance', 'support', 'supervisor'
  model TEXT NOT NULL, -- 'gemini-1.5-pro', 'gpt-4o', etc.
  status TEXT NOT NULL DEFAULT 'success', -- 'success', 'error'
  latency_ms INTEGER DEFAULT 0,
  confidence NUMERIC(4, 3) DEFAULT 0.950,
  needs_human BOOLEAN DEFAULT FALSE,
  reason TEXT,
  token_usage JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tool Calls Table
CREATE TABLE IF NOT EXISTS tool_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_run_id UUID REFERENCES agent_runs(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL, -- 'get_order', 'search_customer', 'dispatch_technician', 'issue_refund'
  arguments JSONB NOT NULL DEFAULT '{}'::jsonb,
  result JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'executed', -- 'executed', 'failed', 'blocked_by_policy'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Human Approvals Queue Table
CREATE TABLE IF NOT EXISTS approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
  agent_run_id UUID REFERENCES agent_runs(id),
  action TEXT NOT NULL, -- 'send_email', 'issue_refund', 'dispatch_technician'
  reason TEXT NOT NULL, -- 'High value refund above threshold', 'Customer angry complaint'
  proposed_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'modified'
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Knowledge Documents Table (RAG)
CREATE TABLE IF NOT EXISTS knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source TEXT NOT NULL, -- 'pdf', 'sop', 'policy', 'manual'
  category TEXT NOT NULL DEFAULT 'general',
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Knowledge Chunks Table (Vector Storage)
CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES knowledge_documents(id) ON DELETE CASCADE NOT NULL,
  chunk_index INTEGER NOT NULL DEFAULT 0,
  chunk_text TEXT NOT NULL,
  embedding vector(1536), -- standard text-embedding dimension (e.g. OpenAI / Gemini)
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL, -- 'human_approved', 'ticket_escalated', 'tool_invoked'
  entity_type TEXT NOT NULL, -- 'ticket', 'approval', 'agent_run'
  entity_id TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow read access to tickets and messages
CREATE POLICY "Allow read tickets" ON tickets FOR SELECT USING (true);
CREATE POLICY "Allow insert tickets" ON tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update tickets" ON tickets FOR UPDATE USING (true);

CREATE POLICY "Allow read messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Allow insert messages" ON messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read knowledge" ON knowledge_documents FOR SELECT USING (true);
CREATE POLICY "Allow read chunks" ON knowledge_chunks FOR SELECT USING (true);

CREATE POLICY "Allow read approvals" ON approvals FOR SELECT USING (true);
CREATE POLICY "Allow update approvals" ON approvals FOR UPDATE USING (true);

-- Seed Sample Data for Instant Testing
INSERT INTO tickets (ticket_number, channel, customer_name, customer_email, customer_room, subject, category, priority, status)
VALUES
  ('TICK-1245', 'chat', 'Hassan Raza', 'hassan.raza@email.com', 'Room 204', 'AC not working in room 204', 'maintenance', 'high', 'open'),
  ('TICK-1244', 'chat', 'Sarah Ahmed', 'sarah.ahmed@email.com', 'Room 108', 'Booking modification & date shift', 'booking', 'medium', 'in_progress'),
  ('TICK-1243', 'chat', 'Ali Khan', 'ali.khan@email.com', 'Deluxe Suite 312', 'Room availability inquiry for next Friday', 'booking', 'low', 'resolved'),
  ('TICK-1242', 'chat', 'Zara Malik', 'zara.malik@email.com', 'Executive Suite 501', 'Airport pickup service request', 'general', 'low', 'resolved'),
  ('TICK-1241', 'email', 'Sara Khan', 'sara@example.com', 'Room 108', 'Refund request for delayed order ORD-10021', 'refund', 'high', 'in_progress')
ON CONFLICT (ticket_number) DO NOTHING;

