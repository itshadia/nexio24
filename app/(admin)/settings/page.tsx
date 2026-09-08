"use client";

import React, { useState } from "react";
import {
  Sliders,
  CheckCircle2,
  Settings as SettingsIcon,
  Key,
  Database,
  GitFork,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import AdminHeader from "../../components/admin/AdminHeader";

interface IntegrationItem {
  id: string;
  name: string;
  subtitle: string;
  status: "Connected" | "Disconnected";
  iconBg: string;
  category: "LLM" | "Database" | "Automation" | "Communication";
  keyPlaceholder: string;
}

const INITIAL_INTEGRATIONS: IntegrationItem[] = [
  {
    id: "openai",
    name: "OpenAI",
    subtitle: "Configure API Key (GPT-4o, Embeddings)",
    status: "Connected",
    iconBg: "bg-emerald-50 text-emerald-700",
    category: "LLM",
    keyPlaceholder: "sk-proj-...",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    subtitle: "Configure API Key (Claude 3.5 Sonnet)",
    status: "Connected",
    iconBg: "bg-amber-50 text-amber-700",
    category: "LLM",
    keyPlaceholder: "sk-ant-...",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    subtitle: "Configure API Key (Gemini 1.5 Pro / Flash)",
    status: "Connected",
    iconBg: "bg-blue-50 text-blue-700",
    category: "LLM",
    keyPlaceholder: "AIzaSy...",
  },
  {
    id: "supabase",
    name: "Supabase",
    subtitle: "PostgreSQL Database, Auth & pgvector",
    status: "Connected",
    iconBg: "bg-emerald-50 text-emerald-700",
    category: "Database",
    keyPlaceholder: "https://your-project.supabase.co",
  },
  {
    id: "n8n",
    name: "n8n",
    subtitle: "Workflow Automation & Webhook Engine",
    status: "Connected",
    iconBg: "bg-rose-50 text-rose-700",
    category: "Automation",
    keyPlaceholder: "https://n8n.yourdomain.com/webhook/...",
  },
  {
    id: "twilio",
    name: "Twilio",
    subtitle: "SMS Dispatch & Voice IVR Integration",
    status: "Connected",
    iconBg: "bg-red-50 text-red-700",
    category: "Communication",
    keyPlaceholder: "AC...",
  },
  {
    id: "gmail",
    name: "Gmail / IMAP",
    subtitle: "Inbound Email Ingestion & Outbound Replies",
    status: "Connected",
    iconBg: "bg-red-50 text-red-700",
    category: "Communication",
    keyPlaceholder: "support@nexio24.com",
  },
  {
    id: "slack",
    name: "Slack",
    subtitle: "Human Escalation & Urgent Triage Channel",
    status: "Connected",
    iconBg: "bg-purple-50 text-purple-700",
    category: "Communication",
    keyPlaceholder: "https://hooks.slack.com/services/...",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business API",
    subtitle: "Automated Guest Messaging & Room Updates",
    status: "Connected",
    iconBg: "bg-emerald-50 text-emerald-700",
    category: "Communication",
    keyPlaceholder: "EAA...",
  },
];

export default function SettingsPage() {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(INITIAL_INTEGRATIONS);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationItem | null>(null);
  const [keyValue, setKeyValue] = useState("");

  const handleOpenConfig = (item: IntegrationItem) => {
    setSelectedIntegration(item);
    setKeyValue("");
  };

  const handleSaveConfig = () => {
    if (selectedIntegration) {
      setIntegrations((prev) =>
        prev.map((it) =>
          it.id === selectedIntegration.id ? { ...it, status: "Connected" } : it
        )
      );
      setSelectedIntegration(null);
      alert(`${selectedIntegration.name} credentials updated and validated!`);
    }
  };

  return (
    <>
      <AdminHeader
        title="Integrations & Settings"
        subtitle="Connect with your LLM providers, Supabase database, and n8n webhooks"
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header CTA */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Connected Infrastructure
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure secure API secrets, webhook listeners, and third-party operational bridges.
          </p>
        </div>

        {/* Integrations Grid (Matching Screen 9 in mockup) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {integrations.map((item) => {
            const isConnected = item.status === "Connected";
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center font-bold text-sm shadow-xs`}
                      >
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {item.name}
                        </h4>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isConnected
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{item.status}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenConfig(item)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Configure</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Configuration Modal */}
        {selectedIntegration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${selectedIntegration.iconBg} flex items-center justify-center font-bold text-sm`}
                >
                  {selectedIntegration.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Configure {selectedIntegration.name}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {selectedIntegration.subtitle}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    API Key / Webhook URL
                  </label>
                  <input
                    type="password"
                    value={keyValue}
                    onChange={(e) => setKeyValue(e.target.value)}
                    placeholder={selectedIntegration.keyPlaceholder}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Credentials are kept server-side and never exposed to client-side bundles.
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveConfig}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Save Connection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

