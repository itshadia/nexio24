"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Wrench,
  BookOpen,
  Send,
  Check,
  AlertTriangle,
  RotateCw,
  MessageSquare,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import AdminHeader from "../../../components/admin/AdminHeader";
import { INITIAL_TICKETS } from "../page";

interface TicketData {
  id: string;
  ticket_number: string;
  customer_name: string;
  customer_email: string;
  customer_room?: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  channel?: string;
  created_at: string;
  metadata?: any;
}

interface MessageItem {
  id: string;
  ticket_id: string;
  direction: "inbound" | "outbound" | "internal";
  sender: "customer" | "ai_agent" | "staff";
  sender_name?: string;
  body: string;
  created_at: string;
}

interface ApprovalItem {
  id: string;
  ticket_id: string;
  action: string;
  reason: string;
  proposed_payload: any;
  status: "pending" | "approved" | "rejected";
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export default function TicketDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id ? String(params.id) : "1245";
  const cleanId = decodeURIComponent(rawId).replace(/^#/, "").trim();

  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [approval, setApproval] = useState<ApprovalItem | null>(null);

  const [draftReply, setDraftReply] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [showAllMessages, setShowAllMessages] = useState(true);

  // Generates intelligent draft response based on ticket details
  const generateInitialDraft = (t: TicketData, app: ApprovalItem | null, msgs: MessageItem[]) => {
    const name = t.customer_name || "Guest";
    const room = t.customer_room || "your room";
    const cat = (t.category || "").toLowerCase();

    if (cat === "refund" || app?.action === "issue_refund") {
      const amt = app?.proposed_payload?.amount || 100;
      return `Hello ${name}, I have personally reviewed and approved your refund request for $${amt}. The adjustment has been applied to your reservation account. We apologize for the inconvenience and hope you enjoy the remainder of your stay.`;
    }

    if (cat === "maintenance") {
      return `Hello ${name}, I have escalated your request regarding "${t.subject}". Our engineering specialist Tariq has been dispatched to ${room} with replacement parts and will arrive within 8 minutes. Please let us know if we can assist you with anything else in the meantime.`;
    }

    if (cat === "booking") {
      return `Hello ${name}, thank you for contacting Nexio24 concierge. I have reviewed your reservation inquiry regarding ${room}. Our front desk team has updated your preferences. Please let us know if you need any additional arrangements.`;
    }

    // Check if there was an AI reply to refine
    const lastAiMsg = [...msgs].reverse().find((m) => m.sender === "ai_agent");
    if (lastAiMsg?.body) {
      return `Hello ${name}, following up on your request: ${lastAiMsg.body}`;
    }

    return `Hello ${name}, our operations team has reviewed your inquiry. We are taking care of this immediately and will keep you updated.`;
  };

  const fetchTicketData = useCallback(async () => {
    setLoading(true);
    setActionSuccess(null);
    try {
      const res = await fetch(`/api/tickets/${encodeURIComponent(cleanId)}`);

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.ticket) {
          const t: TicketData = data.ticket;
          const msgs: MessageItem[] = data.messages || [];
          const app: ApprovalItem | null = data.approvals?.[0] || null;

          setTicket(t);
          setMessages(msgs);
          setApproval(app);
          setDraftReply(generateInitialDraft(t, app, msgs));
          setLoading(false);
          return;
        }
      }

      // Fallback: Check mock tickets (e.g. #1245, #1244)
      const mock = INITIAL_TICKETS.find(
        (t) =>
          t.id.replace("#", "") === cleanId ||
          t.id === `#${cleanId}` ||
          cleanId === "1245"
      );

      if (mock) {
        const fallbackTicket: TicketData = {
          id: mock.id,
          ticket_number: mock.id,
          customer_name: mock.customer,
          customer_email: mock.email,
          customer_room: mock.room || "Room 204",
          subject: mock.subject,
          category: mock.type.toLowerCase(),
          priority: mock.priority.toLowerCase(),
          status: mock.status.toLowerCase().replace(" ", "_"),
          created_at: new Date().toISOString(),
        };

        const fallbackMsgs: MessageItem[] = [
          {
            id: "msg-mock-1",
            ticket_id: mock.id,
            direction: "inbound",
            sender: "customer",
            sender_name: mock.customer,
            body: `Hi, ${mock.subject}. Could someone please check this for me?`,
            created_at: new Date(Date.now() - 600000).toISOString(),
          },
          {
            id: "msg-mock-2",
            ticket_id: mock.id,
            direction: "outbound",
            sender: "ai_agent",
            sender_name: "Nexio24 AI Concierge",
            body: `Hello ${mock.customer}, I have registered ticket ${mock.id} and alerted our hotel operations team.`,
            created_at: new Date(Date.now() - 300000).toISOString(),
          },
        ];

        setTicket(fallbackTicket);
        setMessages(fallbackMsgs);
        setApproval(null);
        setDraftReply(generateInitialDraft(fallbackTicket, null, fallbackMsgs));
      } else {
        // Fallback default
        const defaultTicket: TicketData = {
          id: cleanId,
          ticket_number: cleanId.startsWith("TICK-") ? cleanId : `TICK-${cleanId}`,
          customer_name: "Valued Guest",
          customer_email: "guest@nexio24.com",
          customer_room: "Room 101",
          subject: "Concierge Assistance Request",
          category: "general",
          priority: "medium",
          status: "open",
          created_at: new Date().toISOString(),
        };
        setTicket(defaultTicket);
        setDraftReply(generateInitialDraft(defaultTicket, null, []));
      }
    } catch (err) {
      console.error("Error fetching ticket details:", err);
    } finally {
      setLoading(false);
    }
  }, [cleanId]);

  useEffect(() => {
    fetchTicketData();
  }, [fetchTicketData]);

  // Human-in-the-Loop Actions
  const handleAction = async (action: "approve" | "resolve" | "escalate") => {
    if (!ticket) return;
    setActionLoading(true);
    setActionSuccess(null);

    try {
      const res = await fetch(`/api/tickets/${encodeURIComponent(cleanId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          replyMessage: draftReply,
          adminName: "Hadia Asghar (Admin)",
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        if (action === "approve") {
          setTicket((prev) => (prev ? { ...prev, status: "in_progress" } : prev));
          if (approval) {
            setApproval((prev) => (prev ? { ...prev, status: "approved" } : prev));
          }
          setActionSuccess("Approved by Hadia Asghar (Admin). Outbound response sent to guest.");
        } else if (action === "resolve") {
          setTicket((prev) => (prev ? { ...prev, status: "resolved" } : prev));
          setActionSuccess("Ticket marked as Resolved.");
        } else if (action === "escalate") {
          setTicket((prev) =>
            prev ? { ...prev, status: "escalated", priority: "critical" } : prev
          );
          setActionSuccess("Ticket escalated to Critical Priority.");
        }

        if (result.newMessage) {
          setMessages((prev) => [...prev, result.newMessage]);
        }
      } else {
        // Local simulation if demo ticket not in DB
        if (action === "approve") {
          setTicket((prev) => (prev ? { ...prev, status: "in_progress" } : prev));
          setActionSuccess("Approved by Hadia Asghar (Admin). Outbound response sent to guest.");
        } else if (action === "resolve") {
          setTicket((prev) => (prev ? { ...prev, status: "resolved" } : prev));
          setActionSuccess("Ticket marked as Resolved.");
        } else if (action === "escalate") {
          setTicket((prev) =>
            prev ? { ...prev, status: "escalated", priority: "critical" } : prev
          );
          setActionSuccess("Ticket escalated to Critical Priority.");
        }
      }
    } catch (err) {
      console.error("Action error:", err);
      setActionSuccess("Action executed locally.");
    } finally {
      setActionLoading(false);
    }
  };

  const displayTicketNumber = ticket?.ticket_number || (cleanId.startsWith("TICK-") ? cleanId : `#${cleanId}`);
  const isApproved = ticket?.status === "in_progress" || approval?.status === "approved";
  const isResolved = ticket?.status === "resolved";
  const isEscalated = ticket?.status === "escalated" || ticket?.priority === "critical";

  // Category & Priority Normalization
  const categoryStr = (ticket?.category || "general").toLowerCase();
  const priorityStr = (ticket?.priority || "medium").toLowerCase();
  const statusStr = (ticket?.status || "open").toLowerCase().replace("_", " ");

  // Latest customer inbound message
  const customerInboundMsgs = messages.filter((m) => m.direction === "inbound" || m.sender === "customer");
  const primaryInboundMsg = customerInboundMsgs[customerInboundMsgs.length - 1]?.body || ticket?.subject || "Guest inquiry";

  return (
    <>
      <AdminHeader
        title={`Ticket ${displayTicketNumber} — AI Deep Dive`}
        subtitle="End-to-end audit: Ingestion, Triage, RAG Sources, Tool Execution, and Human Guardrail"
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Navigation & Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/tickets"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">
                  {ticket?.subject || "Loading ticket..."}
                </h2>
                <span className="font-mono text-sm text-indigo-600 font-bold">
                  {displayTicketNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Channel: {ticket?.channel || "In-Room Chat Widget"} • Created:{" "}
                {ticket?.created_at ? new Date(ticket.created_at).toLocaleString() : "Recently"}
              </p>
            </div>
          </div>

          {/* Badges & Refresh */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={fetchTicketData}
              disabled={loading}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shadow-xs"
              title="Refresh ticket data"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>

            {/* Priority Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${
                priorityStr === "critical" || priorityStr === "high"
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : priorityStr === "medium"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              Priority: {priorityStr}
            </span>

            {/* Category Badge */}
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold capitalize">
              Category: {categoryStr}
            </span>

            {/* Status Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${
                statusStr === "resolved"
                  ? "bg-slate-100 text-slate-700 border-slate-300"
                  : statusStr === "in progress"
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : statusStr === "escalated"
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              Status: {statusStr}
            </span>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Message Timeline & AI Reasoning */}
          <div className="lg:col-span-2 space-y-6">
            {/* Original Inbound Customer Message & Conversation Thread */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {ticket?.customer_name ? ticket.customer_name.charAt(0).toUpperCase() : "G"}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {ticket?.customer_name || "Guest"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {ticket?.customer_email || "guest@nexio24.com"} •{" "}
                      {ticket?.customer_room || "Room"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">
                    {ticket?.created_at ? new Date(ticket.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Live"}
                  </span>
                  {messages.length > 1 && (
                    <button
                      onClick={() => setShowAllMessages(!showAllMessages)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors ml-2"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{messages.length} msgs</span>
                      {showAllMessages ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Inbound Customer Quote */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-sm text-slate-800 leading-relaxed font-sans">
                "{primaryInboundMsg}"
              </div>

              {/* Full Conversation Thread (Expandable) */}
              {showAllMessages && messages.length > 1 && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Live Conversation Stream ({messages.length} exchanges)
                  </p>
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {messages.map((m, idx) => {
                      const isInbound = m.direction === "inbound" || m.sender === "customer";
                      const isStaff = m.sender === "staff";

                      return (
                        <div
                          key={m.id || idx}
                          className={`p-3 rounded-xl text-xs flex flex-col gap-1 ${
                            isInbound
                              ? "bg-slate-100 text-slate-800 border border-slate-200"
                              : isStaff
                              ? "bg-indigo-50/80 text-indigo-950 border border-indigo-200 ml-6"
                              : "bg-emerald-50/80 text-emerald-950 border border-emerald-200 ml-6"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="flex items-center gap-1">
                              {isInbound ? (
                                <User className="w-3 h-3 text-slate-600" />
                              ) : isStaff ? (
                                <ShieldCheck className="w-3 h-3 text-indigo-600" />
                              ) : (
                                <Bot className="w-3 h-3 text-emerald-600" />
                              )}
                              <span>
                                {m.sender_name || (isInbound ? ticket?.customer_name : isStaff ? "Staff Admin" : "AI Concierge")}
                              </span>
                            </span>
                            <span className="text-slate-400 font-normal">
                              {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <p className="leading-relaxed whitespace-pre-wrap">{m.body}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* AI Triage & Structured Extraction (Flagship Recruiter Showcase) */}
            <div className="bg-white rounded-2xl p-6 border border-indigo-200/70 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-2xl pointer-events-none -z-10" />

              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      AI Triage & Structured Extraction
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Autonomous classification via Gemini Multi-Agent & Zod Schema
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confidence: 96%</span>
                  </span>
                  <span className="text-xs text-slate-400">Latency: 380ms</span>
                </div>
              </div>

              {/* Extracted Entities Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Category
                  </span>
                  <span className="text-xs font-bold text-indigo-700 capitalize">
                    {categoryStr}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Priority
                  </span>
                  <span
                    className={`text-xs font-bold capitalize ${
                      priorityStr === "critical" || priorityStr === "high"
                        ? "text-rose-600"
                        : priorityStr === "medium"
                        ? "text-amber-600"
                        : "text-slate-700"
                    }`}
                  >
                    {priorityStr} (Sub-{priorityStr === "critical" ? "10" : priorityStr === "high" ? "15" : "60"} SLA)
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Room / Location
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {ticket?.customer_room || "Guest Room"}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Customer Sentiment
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      categoryStr === "refund" || priorityStr === "critical"
                        ? "text-rose-600"
                        : categoryStr === "maintenance"
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {categoryStr === "refund"
                      ? "High Concern / Financial"
                      : priorityStr === "critical"
                      ? "Urgent / Disrupted"
                      : categoryStr === "maintenance"
                      ? "Concerned / Inconvenienced"
                      : "Positive / Inquiring"}
                  </span>
                </div>
              </div>

              {/* Triage Reasoning Chain */}
              <div className="space-y-2 text-xs text-slate-600 bg-indigo-50/40 p-4 rounded-xl border border-indigo-100/70">
                <h4 className="font-bold text-indigo-900 uppercase text-[10px] tracking-wider">
                  Agent Chain of Thought
                </h4>
                <p>
                  • <strong>Intent</strong>: Guest reported:{" "}
                  <span className="italic text-slate-800 font-medium">"{ticket?.subject}"</span>.
                </p>
                <p>
                  • <strong>Policy Check</strong>:{" "}
                  {categoryStr === "refund"
                    ? "Financial Risk Gate: Any compensation or refund request requires mandatory human managerial sign-off."
                    : categoryStr === "maintenance"
                    ? "In-Room HVAC & Facilities SOP: Immediate dispatch is mandatory for temperature and plumbing faults."
                    : categoryStr === "booking"
                    ? "VIP Concierge Protocol: Reservation modifications must verify live PMS inventory."
                    : "Guest Relations Standards: Inquiry triaged with knowledge grounding and instant response."}
                </p>
                <p>
                  • <strong>Tool Triggered</strong>:{" "}
                  <code className="bg-white px-1.5 py-0.5 rounded text-indigo-600 font-mono">
                    {categoryStr === "refund"
                      ? `flag_for_finance_approval(amount=${approval?.proposed_payload?.amount || 100}, reason="refund_request")`
                      : categoryStr === "maintenance"
                      ? `dispatch_technician(room="${ticket?.customer_room || '24'}", trade="${primaryInboundMsg.toLowerCase().includes('ac') ? 'HVAC' : 'General Maintenance'}")`
                      : categoryStr === "booking"
                      ? `verify_room_inventory(room="${ticket?.customer_room || '24'}")`
                      : `query_concierge_knowledge(category="general")`}
                  </code>
                </p>
              </div>
            </div>

            {/* Approved Tools Executed */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Approved Tool Executions
                </h3>
              </div>

              <div className="space-y-3">
                {categoryStr === "refund" ? (
                  <>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-600">
                            flag_for_finance_approval()
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                            PENDING HITL GATE
                          </span>
                        </div>
                        <p className="text-slate-500 font-mono text-[11px]">
                          Args: {`{ amount: $${approval?.proposed_payload?.amount || 100}, guest: '${ticket?.customer_name}' }`}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-slate-700 block">
                          Finance Guardrail
                        </span>
                        <span className="text-[10px] text-amber-600 font-medium">Awaiting Manager</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-600">
                            notify_duty_manager()
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            SUCCESS (200)
                          </span>
                        </div>
                        <p className="text-slate-500 font-mono text-[11px]">
                          Channel: <span className="font-bold text-slate-800">#hotel-ops-escalations</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400">Synced with Supabase</span>
                      </div>
                    </div>
                  </>
                ) : categoryStr === "maintenance" ? (
                  <>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-600">
                            dispatch_technician()
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            SUCCESS (200)
                          </span>
                        </div>
                        <p className="text-slate-500 font-mono text-[11px]">
                          Args: {`{ room: '${ticket?.customer_room || "24"}', trade: '${primaryInboundMsg.toLowerCase().includes("ac") ? "HVAC" : "Maintenance"}', sla_mins: 15 }`}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-slate-700 block">
                          Tariq (HVAC Specialist)
                        </span>
                        <span className="text-[10px] text-slate-400">ETA: 8 mins</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-600">
                            create_maintenance_task()
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            SUCCESS (200)
                          </span>
                        </div>
                        <p className="text-slate-500 font-mono text-[11px]">
                          Task ID: <span className="font-bold text-slate-800">#MNT-{ticket?.ticket_number?.replace(/\D/g, "") || "8041"}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400">Synced with Supabase</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-600">
                            verify_guest_reservation()
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            SUCCESS (200)
                          </span>
                        </div>
                        <p className="text-slate-500 font-mono text-[11px]">
                          Args: {`{ guest: '${ticket?.customer_name}', room: '${ticket?.customer_room || "24"}' }`}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-slate-700 block">
                          PMS Connector
                        </span>
                        <span className="text-[10px] text-emerald-600">Verified</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-indigo-600">
                            log_concierge_interaction()
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            SUCCESS (200)
                          </span>
                        </div>
                        <p className="text-slate-500 font-mono text-[11px]">
                          Channel: <span className="font-bold text-slate-800">In-Room Chat</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400">Synced with Supabase</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right 1 Col: RAG Sources & Human-in-the-loop Guardrail */}
          <div className="space-y-6">
            {/* RAG Knowledge Base Sources Retrieved */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  RAG Grounded Sources
                </h3>
              </div>

              <div className="space-y-3">
                {categoryStr === "refund" ? (
                  <>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-bold text-slate-900">
                          Guest Compensation & Refund Policy
                        </h4>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                          96% Match
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed italic">
                        "Refunds and financial credits require Human-in-the-loop managerial approval. Immediate goodwill credits under $150 may be approved by Head of Concierge."
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-bold text-slate-900">
                          Billing Dispute Resolution Protocol
                        </h4>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                          91% Match
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed italic">
                        "Document the specific nature of grievance on the reservation folio. Notify the guest immediately upon authorization."
                      </p>
                    </div>
                  </>
                ) : categoryStr === "maintenance" ? (
                  <>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-bold text-slate-900">
                          HVAC & In-Room Climate SOP
                        </h4>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                          94% Match
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed italic">
                        "Thermostat error codes and cooling complaints require rapid dispatch within 15 minutes. Facilities lead must verify air relay switches."
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-bold text-slate-900">
                          Guest Disruption Guidelines
                        </h4>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                          88% Match
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed italic">
                        "If temperature repairs exceed 20 minutes, offer complimentary lounge access or beverage service."
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-bold text-slate-900">
                          Nexio24 Hospitality Standards
                        </h4>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                          95% Match
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed italic">
                        "Address guests warmly by name, confirm details promptly, and record all service interactions in the guest profile."
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-bold text-slate-900">
                          Concierge Directory & Timings
                        </h4>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                          90% Match
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed italic">
                        "Breakfast hours: 7:00 AM - 10:30 AM at The Grand Verandah. Rooftop pool open 6:00 AM - 10:00 PM."
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Human-in-the-Loop Approval & Reply Dispatch */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Human-in-the-Loop Guardrail
                  </h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isResolved
                      ? "bg-slate-100 text-slate-700"
                      : isApproved
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {isResolved
                    ? "Resolved"
                    : isApproved
                    ? "Approved & Dispatched"
                    : "Pending Staff Review"}
                </span>
              </div>

              {/* Financial approval banner if pending refund */}
              {approval && approval.status === "pending" && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <DollarSign className="w-4 h-4 text-amber-700" />
                    <span>Refund Approval Requested: ${approval.proposed_payload?.amount || 100}</span>
                  </div>
                  <p className="text-[11px] text-amber-700">
                    Reason: "{approval.reason}"
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Staff / AI Drafted Response to Guest
                </label>
                <textarea
                  rows={4}
                  value={draftReply}
                  onChange={(e) => setDraftReply(e.target.value)}
                  placeholder="Type or modify reply to guest..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 leading-relaxed font-sans"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleAction("approve")}
                  disabled={actionLoading || isApproved || isResolved}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-emerald-600 disabled:cursor-default text-white rounded-xl shadow-xs text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {actionLoading ? (
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>
                    {isApproved
                      ? "Approved & Dispatched"
                      : approval
                      ? "Approve Refund & Send Reply"
                      : "Approve & Send to Guest"}
                  </span>
                </button>

                <button
                  onClick={() => handleAction("escalate")}
                  disabled={actionLoading || isEscalated}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-slate-200/80"
                  title="Escalate to Operations Manager"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </button>

                <button
                  onClick={() => handleAction("resolve")}
                  disabled={actionLoading || isResolved}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-slate-200/80"
                  title="Mark as Resolved"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </button>
              </div>

              {/* Success Notification Alert */}
              {actionSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-semibold flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{actionSuccess}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
