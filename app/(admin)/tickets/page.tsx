"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  ExternalLink,
  RotateCw,
} from "lucide-react";
import AdminHeader from "../../components/admin/AdminHeader";
import { supabase } from "@/lib/supabase/client";

export interface TicketItem {
  id: string;
  customer: string;
  email: string;
  room?: string;
  subject: string;
  type: "Maintenance" | "Booking" | "Support" | "Refund";
  priority: "High" | "Medium" | "Low" | "Critical";
  status: "Open" | "In Progress" | "Resolved" | "Escalated";
  created: string;
  confidence: number;
}

export const INITIAL_TICKETS: TicketItem[] = [
  {
    id: "#1245",
    customer: "Hassan Raza",
    email: "hassan.raza@email.com",
    room: "Room 204",
    subject: "AC not working in room 204",
    type: "Maintenance",
    priority: "High",
    status: "Open",
    created: "10 mins ago",
    confidence: 0.96,
  },
  {
    id: "#1244",
    customer: "Sarah Ahmed",
    email: "sarah.ahmed@email.com",
    room: "Room 108",
    subject: "Booking modification & date shift",
    type: "Booking",
    priority: "Medium",
    status: "In Progress",
    created: "1 hour ago",
    confidence: 0.92,
  },
  {
    id: "#1243",
    customer: "Ali Khan",
    email: "ali.khan@email.com",
    room: "Deluxe Suite 312",
    subject: "Room availability inquiry for next Friday",
    type: "Support",
    priority: "Low",
    status: "Resolved",
    created: "2 hours ago",
    confidence: 0.98,
  },
  {
    id: "#1242",
    customer: "Zara Malik",
    email: "zara.malik@email.com",
    room: "Executive Suite 501",
    subject: "Airport pickup service request",
    type: "Support",
    priority: "Low",
    status: "Resolved",
    created: "3 hours ago",
    confidence: 0.95,
  },
  {
    id: "#1241",
    customer: "Sara Khan",
    email: "sara@example.com",
    subject: "Refund request for delayed order ORD-10021",
    type: "Refund",
    priority: "High",
    status: "In Progress",
    created: "5 hours ago",
    confidence: 0.89,
  },
];

export default function TicketsPage() {
  const [filterTab, setFilterTab] = useState<"All" | "Open" | "In Progress" | "Resolved">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [tickets, setTickets] = useState<TicketItem[]>(INITIAL_TICKETS);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const liveTickets: TicketItem[] = data.map((t: any) => {
          let category: TicketItem["type"] = "Support";
          if (t.category === "maintenance") category = "Maintenance";
          else if (t.category === "booking") category = "Booking";
          else if (t.category === "refund") category = "Refund";

          let priority: TicketItem["priority"] = "Medium";
          if (t.priority === "critical") priority = "Critical";
          else if (t.priority === "high") priority = "High";
          else if (t.priority === "low") priority = "Low";

          let status: TicketItem["status"] = "Open";
          if (t.status === "in_progress") status = "In Progress";
          else if (t.status === "resolved") status = "Resolved";
          else if (t.status === "escalated") status = "Escalated";

          return {
            id: t.ticket_number,
            customer: t.customer_name || "Guest",
            email: t.customer_email || "guest@nexio24.com",
            room: t.customer_room || "Room",
            subject: t.subject,
            type: category,
            priority: priority,
            status: status,
            created: new Date(t.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            confidence: 0.95,
          };
        });

        // Combine live Supabase tickets with initial mock tickets
        setTickets(liveTickets);
      }
    } catch {
      // Keep fallback tickets
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((t) => {
    if (filterTab !== "All" && t.status !== filterTab) return false;
    if (
      searchQuery &&
      !t.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <>
      <AdminHeader
        title="Support Tickets"
        subtitle="Manage, classify, and track operational tickets"
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Operational Tickets
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated AI triage with human-in-the-loop escalation guardrails.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchTickets}
              disabled={loading}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Refresh tickets from Supabase"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <Link
              href="/tickets/1245"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Ticket</span>
            </Link>
          </div>
        </div>

        {/* Filters & Search Row */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(["All", "Open", "In Progress", "Resolved"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  filterTab === tab
                    ? "bg-white text-indigo-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets by ID, subject, customer..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Tickets Table (Matching Screen 7 in mockup) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-3.5 px-6">#</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Subject</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Priority</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Created</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-indigo-50/40 transition-colors group cursor-pointer"
                  >
                    {/* ID */}
                    <td className="py-4 px-6 font-bold text-indigo-600 font-mono">
                      {t.id}
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{t.customer}</div>
                      <div className="text-[11px] text-slate-400">
                        {t.room || t.email}
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="py-4 px-6 max-w-xs">
                      <span className="truncate block font-semibold text-slate-800">
                        {t.subject}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Confidence: {Math.round(t.confidence * 100)}%</span>
                      </span>
                    </td>

                    {/* Type / Category */}
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {t.type}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          t.priority === "High" || t.priority === "Critical"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : t.priority === "Medium"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          t.status === "Open"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : t.status === "In Progress"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="py-4 px-6 text-slate-400 text-[11px]">
                      {t.created}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/tickets/${t.id.replace("#", "")}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-semibold text-xs transition-all cursor-pointer"
                      >
                        <span>Investigate</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

