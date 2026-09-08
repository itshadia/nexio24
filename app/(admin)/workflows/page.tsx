"use client";

import React, { useState } from "react";
import {
  GitFork,
  Play,
  Save,
  Search,
  Mail,
  Webhook,
  Clock,
  FileText,
  Bot,
  Database,
  Send,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import AdminHeader from "../../components/admin/AdminHeader";

export default function WorkflowsPage() {
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [activeTestStep, setActiveTestStep] = useState<number | null>(null);

  const handleTestWorkflow = () => {
    setIsRunningTest(true);
    setActiveTestStep(1);

    setTimeout(() => setActiveTestStep(2), 800);
    setTimeout(() => setActiveTestStep(3), 1600);
    setTimeout(() => {
      setIsRunningTest(false);
      setActiveTestStep(null);
      alert("Workflow test execution completed! All 3 branch actions verified.");
    }, 2400);
  };

  return (
    <>
      <AdminHeader
        title="Workflow Builder"
        subtitle="Visual automation pipeline integrated with n8n & Node API"
      />

      <div className="flex-1 flex overflow-hidden max-h-[calc(100vh-64px)]">
        {/* Left Node Palette */}
        <div className="w-72 bg-white border-r border-slate-200 p-5 flex flex-col shrink-0 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Nodes Palette</h3>
            <p className="text-[11px] text-slate-500">
              Drag or click nodes into the canvas
            </p>
          </div>

          <div className="relative mb-5">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search nodes..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Triggers Section */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Triggers
              </span>
              <div className="space-y-1.5">
                {[
                  { name: "Email Trigger", icon: Mail, tag: "IMAP / Gmail" },
                  { name: "Webhook", icon: Webhook, tag: "HTTP Ingest" },
                  { name: "Schedule", icon: Clock, tag: "Cron / Daily" },
                  { name: "Form Trigger", icon: FileText, tag: "Guest Portal" },
                ].map((node, i) => {
                  const Icon = node.icon;
                  return (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors flex items-center justify-between text-xs font-semibold text-slate-700 cursor-grab"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-indigo-600" />
                        <span>{node.name}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-medium">
                        {node.tag}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions Section */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Actions & Agents
              </span>
              <div className="space-y-1.5">
                {[
                  { name: "AI Agent Triage", icon: Bot, tag: "Gemini / GPT" },
                  { name: "HTTP Request", icon: Webhook, tag: "External API" },
                  { name: "Supabase DB", icon: Database, tag: "PostgreSQL" },
                  { name: "Send Gmail", icon: Mail, tag: "Outbound" },
                  { name: "Twilio SMS", icon: MessageSquare, tag: "Telecom" },
                ].map((node, i) => {
                  const Icon = node.icon;
                  return (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors flex items-center justify-between text-xs font-semibold text-slate-700 cursor-grab"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-emerald-600" />
                        <span>{node.name}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-medium">
                        {node.tag}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Center Visual Canvas */}
        <div className="flex-1 bg-slate-50 flex flex-col relative overflow-hidden">
          {/* Top Bar with Save & Test Actions */}
          <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-bold text-xs text-slate-900">
                Active Workflow:
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono text-xs font-bold">
                workflow-a-inbound-triage.json
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTestWorkflow}
                disabled={isRunningTest}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Play className={`w-3.5 h-3.5 ${isRunningTest ? "animate-spin text-indigo-600" : "text-emerald-600"}`} />
                <span>{isRunningTest ? "Testing..." : "Test Workflow"}</span>
              </button>

              <button
                onClick={() => alert("Workflow saved and deployed to n8n webhook!")}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save & Deploy</span>
              </button>
            </div>
          </div>

          {/* Node Canvas Area (Matching Screen 5) */}
          <div className="flex-1 p-10 overflow-auto flex items-center justify-center bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="flex items-center gap-8 max-w-4xl">
              {/* Node 1: Email Trigger */}
              <div
                className={`w-48 bg-white rounded-2xl p-4 border shadow-sm transition-all duration-300 ${
                  activeTestStep === 1
                    ? "border-emerald-500 ring-4 ring-emerald-100 shadow-md"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Email Trigger</h4>
                    <span className="text-[10px] text-slate-400">New Email Event</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg font-mono">
                  host: imap.nexio.com
                </div>
              </div>

              {/* Connecting Arrow */}
              <div className="text-slate-300 font-bold flex items-center">
                <ArrowRight className="w-6 h-6 text-indigo-400" />
              </div>

              {/* Node 2: AI Agent */}
              <div
                className={`w-52 bg-white rounded-2xl p-4 border shadow-sm transition-all duration-300 ${
                  activeTestStep === 2
                    ? "border-indigo-600 ring-4 ring-indigo-100 shadow-md"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">AI Agent</h4>
                    <span className="text-[10px] text-slate-400">Classify & Respond</span>
                  </div>
                </div>
                <div className="text-[10px] text-indigo-700 bg-indigo-50 p-2 rounded-lg font-mono">
                  Schema: Zod Triage Output
                </div>
              </div>

              {/* Connecting Arrow */}
              <div className="text-slate-300 font-bold flex items-center">
                <ArrowRight className="w-6 h-6 text-indigo-400" />
              </div>

              {/* Node 3: 3 Branches (Matching Screen 5) */}
              <div className="flex flex-col gap-3">
                {/* Branch A: Send Reply */}
                <div
                  className={`w-48 bg-white rounded-xl p-3 border shadow-xs transition-all ${
                    activeTestStep === 3
                      ? "border-emerald-500 ring-2 ring-emerald-100"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Send className="w-3.5 h-3.5 text-blue-600" />
                    <div>
                      <h5 className="font-bold text-[11px] text-slate-900">Send Reply</h5>
                      <span className="text-[9px] text-slate-400">Via Gmail API</span>
                    </div>
                  </div>
                </div>

                {/* Branch B: Create Ticket */}
                <div
                  className={`w-48 bg-white rounded-xl p-3 border shadow-xs transition-all ${
                    activeTestStep === 3
                      ? "border-emerald-500 ring-2 ring-emerald-100"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                    <div>
                      <h5 className="font-bold text-[11px] text-slate-900">Create Ticket</h5>
                      <span className="text-[9px] text-slate-400">Supabase RLS</span>
                    </div>
                  </div>
                </div>

                {/* Branch C: Human Review */}
                <div
                  className={`w-48 bg-white rounded-xl p-3 border shadow-xs transition-all ${
                    activeTestStep === 3
                      ? "border-amber-500 ring-2 ring-amber-100"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <div>
                      <h5 className="font-bold text-[11px] text-slate-900">Human Review</h5>
                      <span className="text-[9px] text-slate-400">Slack / Ops Escalation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

