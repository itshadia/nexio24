"use client";

import React, { useState } from "react";
import {
  Bot,
  Plus,
  Calendar,
  Wrench,
  Mail,
  MessageSquare,
  Phone,
  Edit2,
  MoreVertical,
  CheckCircle2,
  Sliders,
  ShieldAlert,
} from "lucide-react";
import AdminHeader from "../../components/admin/AdminHeader";

interface AgentItem {
  id: string;
  name: string;
  desc: string;
  status: "Active" | "Paused" | "Inactive";
  type: string;
  model: string;
  latency: string;
  icon: any;
  color: string;
}

const INITIAL_AGENTS: AgentItem[] = [
  {
    id: "agent-1",
    name: "Customer Support Agent",
    desc: "Handles customer inquiries and FAQs",
    status: "Active",
    type: "Chat + Email",
    model: "Gemini 1.5 Pro / GPT-4o",
    latency: "380ms",
    icon: Bot,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    id: "agent-2",
    name: "Booking Agent",
    desc: "Manages reservations and availability",
    status: "Active",
    type: "Chat + Web",
    model: "Gemini 1.5 Flash",
    latency: "290ms",
    icon: Calendar,
    color: "bg-purple-50 text-purple-600",
  },
  {
    id: "agent-3",
    name: "Maintenance Agent",
    desc: "Creates and tracks maintenance tickets",
    status: "Active",
    type: "Chat + Web",
    model: "Claude 3.5 Sonnet",
    latency: "410ms",
    icon: Wrench,
    color: "bg-amber-50 text-amber-600",
  },
  {
    id: "agent-4",
    name: "Email Agent",
    desc: "Processes and responds to emails",
    status: "Active",
    type: "Email",
    model: "GPT-4o Mini",
    latency: "340ms",
    icon: Mail,
    color: "bg-sky-50 text-sky-600",
  },
  {
    id: "agent-5",
    name: "WhatsApp Agent",
    desc: "Handles WhatsApp conversations",
    status: "Paused",
    type: "WhatsApp",
    model: "Gemini 1.5 Flash",
    latency: "450ms",
    icon: MessageSquare,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "agent-6",
    name: "Voice Agent (Twilio)",
    desc: "Handles voice calls and voice conversations",
    status: "Inactive",
    type: "Voice",
    model: "Twilio + Whisper + Realtime",
    latency: "620ms",
    icon: Phone,
    color: "bg-slate-100 text-slate-600",
  },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentItem[]>(INITIAL_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<AgentItem | null>(null);

  const toggleStatus = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextStatus: AgentItem["status"] =
            a.status === "Active"
              ? "Paused"
              : a.status === "Paused"
              ? "Inactive"
              : "Active";
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  return (
    <>
      <AdminHeader
        title="AI Agents"
        subtitle="Manage your multi-agent architecture and autonomous policies"
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Operational Agent Workforce
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Each specialized agent runs dedicated toolsets, system prompts, and validation guardrails.
            </p>
          </div>

          <button
            onClick={() => alert("Open Agent Creation Wizard")}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Agent</span>
          </button>
        </div>

        {/* Agents Table (Matching Screen 4 in mockup) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-4 px-6">Agents</th>
                  <th className="py-4 px-6">Model & Latency</th>
                  <th className="py-4 px-6">Type / Channel</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {agents.map((agent) => {
                  const Icon = agent.icon;
                  return (
                    <tr
                      key={agent.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Name & Desc */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl ${agent.color} flex items-center justify-center shrink-0`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">
                              {agent.name}
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              {agent.desc}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Model & Latency */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800">
                          {agent.model}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Avg latency: {agent.latency}
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {agent.type}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <button
                          onClick={() => toggleStatus(agent.id)}
                          title="Click to cycle status"
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                            agent.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : agent.status === "Paused"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              agent.status === "Active"
                                ? "bg-emerald-500 animate-pulse"
                                : agent.status === "Paused"
                                ? "bg-amber-500"
                                : "bg-slate-400"
                            }`}
                          />
                          <span>{agent.status}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedAgent(agent)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => alert(`Settings for ${agent.name}`)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Agent Drawer/Modal */}
        {selectedAgent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="font-bold text-base text-slate-900">
                Configure {selectedAgent.name}
              </h3>
              <p className="text-xs text-slate-500">
                Update prompt guidelines, temperature, and assigned tool allowlist.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    System Model
                  </label>
                  <select className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium">
                    <option>Gemini 1.5 Pro</option>
                    <option>GPT-4o</option>
                    <option>Claude 3.5 Sonnet</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Temperature & Guardrail
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue="0.2"
                    className="w-full accent-indigo-600"
                  />
                  <span className="text-[10px] text-slate-400">
                    Deterministic (0.2) recommended for policy grounding
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert("Configuration saved successfully!");
                    setSelectedAgent(null);
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Save Config
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

