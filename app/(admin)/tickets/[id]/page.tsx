"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  Sliders,
  Check,
  X,
  FileText,
  AlertTriangle,
  Cpu,
} from "lucide-react";
import AdminHeader from "../../../components/admin/AdminHeader";

export default function TicketDetailsPage() {
  const params = useParams();
  const ticketId = params?.id ? `#${params.id}` : "#1245";

  const [approvalStatus, setApprovalStatus] = useState<"pending" | "approved" | "edited">("pending");
  const [draftReply, setDraftReply] = useState(
    "Hello Hassan, I have escalated ticket #1245 to our engineering lead. Technician Tariq is en route to Room 204 with replacement AC thermal relays and will arrive in approximately 8 minutes. Please let us know if we can bring you refreshments in the meantime."
  );

  return (
    <>
      <AdminHeader
        title={`Ticket ${ticketId} — AI Deep Dive`}
        subtitle="End-to-end audit: Ingestion, Triage, RAG Sources, Tool Execution, and Human Guardrail"
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Navigation & Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/tickets"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">
                  AC not working in room 204
                </h2>
                <span className="font-mono text-sm text-indigo-600 font-bold">
                  {ticketId}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Created via In-Room Chat Widget • Received 10 minutes ago
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
              Priority: High
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold">
              Category: Maintenance
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              Status: Open
            </span>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Message Timeline & AI Reasoning */}
          <div className="lg:col-span-2 space-y-6">
            {/* Original Inbound Customer Message */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                    H
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Hassan Raza
                    </h3>
                    <p className="text-xs text-slate-400">
                      hassan.raza@email.com • Room 204 (Deluxe Room)
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Today at 10:48 AM
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-800 leading-relaxed font-sans">
                "Hi, the air conditioning unit in room 204 seems completely unresponsive. 
                The thermostat displays error code E-04 and the room is getting quite warm. 
                Could someone please send up an engineer to fix this?"
              </div>
            </div>

            {/* AI Triage & Extraction Breakdown (Flagship Recruiter Showcase) */}
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
                      Autonomous classification via Zod Schema validation
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
                  <span className="text-xs font-bold text-indigo-700">
                    Maintenance
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Priority
                  </span>
                  <span className="text-xs font-bold text-rose-600">
                    High (Sub-15 SLA)
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Room / Location
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Room 204
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Customer Sentiment
                  </span>
                  <span className="text-xs font-bold text-amber-600">
                    Negative / Concerned
                  </span>
                </div>
              </div>

              {/* Triage Reasoning Chain */}
              <div className="space-y-2 text-xs text-slate-600 bg-indigo-50/40 p-4 rounded-xl border border-indigo-100/70">
                <h4 className="font-bold text-indigo-900 uppercase text-[10px] tracking-wider">
                  Agent Chain of Thought
                </h4>
                <p>
                  • <strong>Intent</strong>: Guest reported inoperable climate control (Error E-04) in Room 204.
                </p>
                <p>
                  • <strong>Policy Check</strong>: In-Room HVAC SOP states immediate dispatch is mandatory for temperature faults.
                </p>
                <p>
                  • <strong>Tool Triggered</strong>: Dispatched tool <code className="bg-white px-1.5 py-0.5 rounded text-indigo-600 font-mono">dispatch_technician(room="204", trade="HVAC")</code>.
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
                      Args: {"{ room: '204', trade: 'HVAC', sla_mins: 15 }"}
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
                      Task ID: <span className="font-bold text-slate-800">#MNT-8041</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">Synced with Supabase</span>
                  </div>
                </div>
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
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-bold text-slate-900">
                      HVAC Troubleshooting SOP
                    </h4>
                    <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                      94% Match
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed italic">
                    "Error E-04 indicates thermal switch lock. Engineering must inspect power relay and reset the breaker within 15 minutes."
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-bold text-slate-900">
                      Guest Compensation Guidelines
                    </h4>
                    <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                      88% Match
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed italic">
                    "If temperature delay exceeds 20 minutes, offer complimentary lounge access or beverage service."
                  </p>
                </div>
              </div>
            </div>

            {/* Human-in-the-Loop Approval & Reply Dispatch */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Human-in-the-Loop
                  </h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    approvalStatus === "approved"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {approvalStatus === "approved" ? "Approved & Sent" : "Pending Staff Review"}
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  AI Drafted Customer Response
                </label>
                <textarea
                  rows={4}
                  value={draftReply}
                  onChange={(e) => setDraftReply(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setApprovalStatus("approved")}
                  disabled={approvalStatus === "approved"}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-emerald-600 text-white rounded-xl shadow-xs text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {approvalStatus === "approved"
                      ? "Reply Dispatched"
                      : "Approve & Send to Guest"}
                  </span>
                </button>

                <button
                  onClick={() => alert("Ticket escalated to Head of Operations.")}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  title="Escalate to Manager"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </button>
              </div>

              {approvalStatus === "approved" && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-semibold flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Audit log updated: Approved by Hadia Asghar (Admin).</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

