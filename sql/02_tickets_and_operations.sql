-- ==============================================================================
-- 02_tickets_and_operations.sql
-- Create Tickets, Messages, AI Agent Runs, Tools, Approvals, and RAG Tables
-- ==============================================================================

-- 1. Enable pgvector extension for RAG vector embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Tickets Table
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL, -- e.g. 'TICK-1245'
  channel TEXT NOT NULL DEFAULT 'chat', -- 'chat', 'email', 'webhook', 'voice', 'whatsapp'
  external_id TEXT,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_room TEXT,
  subject TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general', -- 'order', 'refund', 'technical', 'booking', 'maintenance', 'general'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'escalated'
  assigned_to UUID REFERENCES public.profiles(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  direction TEXT NOT NULL, -- 'inbound', 'outbound', 'internal'
  sender TEXT NOT NULL, -- 'customer', 'ai_agent', 'staff'
  sender_name TEXT,
  body TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Agent Runs Table (Multi-Agent Telemetry, Latency, Token Usage)
CREATE TABLE IF NOT EXISTS public.agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
  agent_name TEXT NOT NULL, -- 'triage', 'booking', 'maintenance', 'support', 'supervisor'
  model TEXT NOT NULL, -- 'gemini-1.5-pro', 'gpt-4o', etc.
  status TEXT NOT NULL DEFAULT 'success', -- 'success', 'error'
  latency_ms INTEGER DEFAULT 0,
  confidence NUMERIC(4, 3) DEFAULT 0.950,
  needs_human BOOLEAN DEFAULT FALSE,
  reason TEXT,
  token_usage JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tool Calls Table
CREATE TABLE IF NOT EXISTS public.tool_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_run_id UUID REFERENCES public.agent_runs(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL, -- 'get_order', 'search_customer', 'dispatch_technician', 'issue_refund'
  arguments JSONB NOT NULL DEFAULT '{}'::jsonb,
  result JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'executed', -- 'executed', 'failed', 'blocked_by_policy'
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Human Approvals Queue Table
CREATE TABLE IF NOT EXISTS public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  agent_run_id UUID REFERENCES public.agent_runs(id),
  action TEXT NOT NULL, -- 'send_email', 'issue_refund', 'dispatch_technician'
  reason TEXT NOT NULL, -- 'High value refund above threshold', 'Customer angry complaint'
  proposed_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'modified'
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Knowledge Documents Table (RAG)
CREATE TABLE IF NOT EXISTS public.knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source TEXT NOT NULL, -- 'pdf', 'sop', 'policy', 'manual'
  category TEXT NOT NULL DEFAULT 'general',
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Knowledge Chunks Table (Vector Storage)
CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.knowledge_documents(id) ON DELETE CASCADE NOT NULL,
  chunk_index INTEGER NOT NULL DEFAULT 0,
  chunk_text TEXT NOT NULL,
  embedding vector(1536), -- Standard embedding dimension (OpenAI / Gemini)
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL, -- 'human_approved', 'ticket_escalated', 'tool_invoked'
  entity_type TEXT NOT NULL, -- 'ticket', 'approval', 'agent_run'
  entity_id TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) FOR TICKETS & DATA PRIVACY
-- ==============================================================================

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Tickets: Customers can only see their own tickets; Admins can see all tickets
DROP POLICY IF EXISTS "Customers view own tickets or admins view all" ON public.tickets;
CREATE POLICY "Customers view own tickets or admins view all" 
ON public.tickets FOR SELECT 
TO authenticated 
USING (
  customer_id = auth.uid()
  OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff')
);

-- Customers can insert new tickets
DROP POLICY IF EXISTS "Anyone authenticated can create tickets" ON public.tickets;
CREATE POLICY "Anyone authenticated can create tickets" 
ON public.tickets FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Admins can update tickets
DROP POLICY IF EXISTS "Admins can update tickets" ON public.tickets;
CREATE POLICY "Admins can update tickets" 
ON public.tickets FOR UPDATE 
TO authenticated 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff')
);

-- Messages: Customers see messages in their tickets; Admins see all
DROP POLICY IF EXISTS "Messages access policy" ON public.messages;
CREATE POLICY "Messages access policy" 
ON public.messages FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.tickets t 
    WHERE t.id = ticket_id 
      AND (t.customer_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff'))
  )
);

-- Public / Authenticated read for knowledge documents & chunks
DROP POLICY IF EXISTS "Read knowledge documents" ON public.knowledge_documents;
CREATE POLICY "Read knowledge documents" ON public.knowledge_documents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Read knowledge chunks" ON public.knowledge_chunks;
CREATE POLICY "Read knowledge chunks" ON public.knowledge_chunks FOR SELECT USING (true);

