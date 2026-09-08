"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUpRight,
  ArrowRight,
  Clock,
  Wrench,
  Mail,
  User,
  ShieldAlert,
} from "lucide-react";
import AdminHeader from "../../components/admin/AdminHeader";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("Aug 1, 2026 - Aug 30, 2026");

  const statCards = [
    {
      title: "Tasks Automated",
      value: "1,248",
      change: "+12%",
      trend: "up",
      icon: Sparkles,
      iconBg: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Success Rate",
      value: "94.7%",
      change: "+5%",
      trend: "up",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Human Escalations",
      value: "73",
      change: "-8%",
      trend: "down-positive",
      icon: AlertTriangle,
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      title: "API Cost",
      value: "$18.42",
      change: "-15%",
      trend: "down-positive",
      icon: DollarSign,
      iconBg: "bg-sky-50 text-sky-600",
    },
  ];

  const recentActivities = [
    {
      id: "act-1",
      title: "New booking request received",
      subtitle: "Ali Khan inquired for Deluxe Room",
      time: "2 mins ago",
      type: "Automated",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "act-2",
      title: "Maintenance ticket created (Room 204)",
      subtitle: "Hassan Raza reported AC cooling failure",
      time: "10 mins ago",
      type: "Escalated",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: "act-3",
      title: "Email response sent to customer",
      subtitle: "Sarah Ahmed confirmed checkout extension",
      time: "25 mins ago",
      type: "Automated",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "act-4",
      title: "FAQ answered by AI",
      subtitle: "Zara Malik queried airport pickup rates",
      time: "40 mins ago",
      type: "Automated",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  const activeAgents = [
    {
      name: "Customer Support Agent",
      desc: "Handles customer inquiries & FAQs",
      status: "Online",
      icon: Bot,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      name: "Booking Agent",
      desc: "Manages reservations & availability",
      status: "Online",
      icon: Calendar,
      color: "text-purple-600 bg-purple-50",
    },
    {
      name: "Maintenance Agent",
      desc: "Creates & tracks technical room tickets",
      status: "Online",
      icon: Wrench,
      color: "text-amber-600 bg-amber-50",
    },
    {
      name: "Email Agent",
      desc: "Processes and responds to emails",
      status: "Online",
      icon: Mail,
      color: "text-sky-600 bg-sky-50",
    },
  ];

  // Daily activity bar chart data (Aug 1 - Aug 28)
  const barData = [
    { date: "Aug 1", automated: 120, human: 18 },
    { date: "Aug 4", automated: 145, human: 15 },
    { date: "Aug 7", automated: 130, human: 22 },
    { date: "Aug 11", automated: 165, human: 14 },
    { date: "Aug 14", automated: 180, human: 12 },
    { date: "Aug 18", automated: 150, human: 19 },
    { date: "Aug 21", automated: 190, human: 10 },
    { date: "Aug 25", automated: 175, human: 11 },
    { date: "Aug 28", automated: 195, human: 8 },
  ];

  const maxVal = 200;

  return (
    <>
      <AdminHeader
        title="Dashboard"
        subtitle="Overview of your AI operations"
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Date Filter & Overview Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Operational Performance
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live metrics across autonomous triage, RAG lookups, and human escalations.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs text-xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>{dateRange}</span>
          </div>
        </div>

        {/* Top 4 KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            const isPositive =
              card.trend === "up" || card.trend === "down-positive";

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                      card.change.startsWith("+")
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    }`}
                  >
                    {card.change.startsWith("+") ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{card.change}</span>
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {card.value}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  {card.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Activity Bar Chart (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Task Activity</h3>
                <p className="text-xs text-slate-500">
                  Daily comparison of AI automated vs human handled tasks
                </p>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-3 h-3 rounded-xs bg-indigo-600" />
                  <span>Automated</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-3 h-3 rounded-xs bg-slate-300" />
                  <span>Human</span>
                </div>
              </div>
            </div>

            {/* Simulated Clean SVG Bar Chart */}
            <div className="h-56 flex items-end justify-between gap-3 pt-4 border-b border-slate-100">
              {barData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="w-full max-w-[28px] flex items-end gap-1 h-full">
                    {/* Automated bar */}
                    <div
                      style={{ height: `${(d.automated / maxVal) * 100}%` }}
                      className="w-1/2 bg-indigo-600 rounded-t-sm group-hover:bg-indigo-700 transition-all relative"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded-md whitespace-nowrap z-10">
                        {d.automated} tasks
                      </div>
                    </div>
                    {/* Human bar */}
                    <div
                      style={{ height: `${(d.human / maxVal) * 100}%` }}
                      className="w-1/2 bg-slate-300 rounded-t-sm group-hover:bg-slate-400 transition-all"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {d.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks by Type Donut Chart (1 Col) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-900">Tasks by Type</h3>
              <p className="text-xs text-slate-500">
                Categorical distribution of inbound tickets
              </p>
            </div>

            {/* Circular Donut Graphic */}
            <div className="relative flex items-center justify-center py-4">
              <div className="w-36 h-36 rounded-full border-12 border-indigo-600 border-t-amber-500 border-r-purple-500 border-b-sky-500 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-900">1,248</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  Tasks
                </span>
              </div>
            </div>

            {/* Breakdown Legend List */}
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <span className="text-slate-700 font-medium">Customer Support</span>
                </div>
                <span className="font-bold text-slate-900">38%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="text-slate-700 font-medium">Bookings</span>
                </div>
                <span className="font-bold text-slate-900">22%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-700 font-medium">Maintenance</span>
                </div>
                <span className="font-bold text-slate-900">18%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span className="text-slate-700 font-medium">Sales / Packages</span>
                </div>
                <span className="font-bold text-slate-900">12%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="text-slate-700 font-medium">Others</span>
                </div>
                <span className="font-bold text-slate-900">10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Recent Activities & Active Agents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Activities</h3>
                <p className="text-xs text-slate-500">Real-time queue actions</p>
              </div>
              <Link
                href="/tickets"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View All Tickets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {act.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {act.subtitle}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {act.time}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${act.badgeColor}`}
                  >
                    {act.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Agents */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Active Agents</h3>
                <p className="text-xs text-slate-500">Operational workforce state</p>
              </div>
              <Link
                href="/agents"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Manage Agents</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {activeAgents.map((agent, i) => {
                const Icon = agent.icon;
                return (
                  <div
                    key={i}
                    className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg ${agent.color} flex items-center justify-center shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {agent.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {agent.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{agent.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

