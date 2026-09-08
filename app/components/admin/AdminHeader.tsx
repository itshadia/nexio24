"use client";

import React from "react";
import Link from "next/link";
import { Search, Bell, Sparkles, ExternalLink, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function AdminHeader({
  title = "Dashboard",
  subtitle = "Overview of your AI operations",
}: AdminHeaderProps) {
  const { admin } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-lg font-bold text-slate-900 leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>
        )}
      </div>

      {/* Center Search */}
      <div className="hidden md:flex items-center w-72 lg:w-96 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Search tickets, customers, tools..."
          className="w-full text-xs pl-9 pr-4 py-2 bg-slate-100/70 hover:bg-slate-100 focus:bg-white rounded-xl border border-slate-200/80 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition-all placeholder-slate-400"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* System Health Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AI Pipeline Active</span>
        </div>

        {/* Link to Customer Site */}
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Guest Site</span>
        </Link>

        {/* Notifications */}
        <button
          title="Notifications"
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
        </button>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={
              admin?.avatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
            }
            alt="Admin"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
          />
        </div>
      </div>
    </header>
  );
}

