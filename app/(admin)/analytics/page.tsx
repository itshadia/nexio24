"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Clock,
  ShieldCheck,
} from "lucide-react";
import AdminHeader from "../../components/admin/AdminHeader";

export default function AnalyticsPage() {
  const [dateRange] = useState("Aug 1, 2026 - Aug 30, 2026");

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

  return (
    <>
      <AdminHeader
        title="Analytics"
        subtitle="Insights into your AI operations, efficiency, and cost"
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Date Filter & Overview Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Operational Intelligence
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive telemetry across multi-agent pipelines, RAG retrieval, and SLA compliance.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs text-xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>{dateRange}</span>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
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

        {/* Charts Row (Matching Screen 8) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Trends Line Chart (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Task Trends</h3>
                <p className="text-xs text-slate-500">
                  Weekly volume trend of inbound operational tickets
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-3 h-3 rounded-full bg-indigo-600" />
                  <span>Automated</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-3 h-3 rounded-full bg-slate-300" />
                  <span>Human</span>
                </div>
              </div>
            </div>

            {/* Smooth SVG Line Chart */}
            <div className="h-60 w-full relative pt-4 flex flex-col justify-between">
              <svg className="w-full h-44 overflow-visible" viewBox="0 0 500 150">
                {/* Horizontal grid lines */}
                <line x1="0" y1="0" x2="500" y2="0" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#e2e8f0" strokeWidth="1" />

                {/* Automated Line */}
                <path
                  d="M 20 110 Q 80 80, 140 95 T 260 70 T 380 40 T 480 25"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Human Line */}
                <path
                  d="M 20 135 Q 80 130, 140 125 T 260 130 T 380 135 T 480 138"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                />

                {/* Key Points */}
                <circle cx="20" cy="110" r="4" fill="#4f46e5" />
                <circle cx="140" cy="95" r="4" fill="#4f46e5" />
                <circle cx="260" cy="70" r="4" fill="#4f46e5" />
                <circle cx="380" cy="40" r="4" fill="#4f46e5" />
                <circle cx="480" cy="25" r="5" fill="#4f46e5" className="animate-pulse" />
              </svg>

              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pt-2 border-t border-slate-100">
                <span>Aug 1</span>
                <span>Aug 7</span>
                <span>Aug 14</span>
                <span>Aug 21</span>
                <span>Aug 28</span>
              </div>
            </div>
          </div>

          {/* Task Distribution (1 Col) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Task Distribution</h3>
              <p className="text-xs text-slate-500">
                Departmental resolution shares
              </p>
            </div>

            <div className="relative flex items-center justify-center py-4">
              <div className="w-36 h-36 rounded-full border-12 border-indigo-600 border-t-amber-500 border-r-purple-500 border-b-sky-500 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-900">1,248</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  Tasks
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Customer Support</span>
                <span className="font-bold text-slate-900">38%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Bookings</span>
                <span className="font-bold text-slate-900">22%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Maintenance</span>
                <span className="font-bold text-slate-900">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Sales / Packages</span>
                <span className="font-bold text-slate-900">12%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">Others</span>
                <span className="font-bold text-slate-900">10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase">Avg Response Latency</span>
            <div className="text-2xl font-black text-slate-900 mt-1">385ms</div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              ✓ Sub-3s SLA Target Maintained
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase">Tool Execution Success</span>
            <div className="text-2xl font-black text-slate-900 mt-1">99.2%</div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              ✓ Zero policy violations
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase">Human Escalation SLA</span>
            <div className="text-2xl font-black text-slate-900 mt-1">11.4 mins</div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              ✓ Below 15-minute SLA
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

