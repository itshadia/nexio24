"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  Bot,
  Inbox,
  Ticket,
  GitFork,
  BookOpen,
  BarChart3,
  Sliders,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, signOutAdmin } = useAuth();

  const handleLogout = async () => {
    await signOutAdmin();
    router.push("/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Agents", href: "/agents", icon: Bot },
    { label: "Inbox", href: "/inbox", icon: Inbox, badge: "3" },
    { label: "Tickets", href: "/tickets", icon: Ticket, badge: "5" },
    { label: "Workflows", href: "/workflows", icon: GitFork },
    { label: "Knowledge Base", href: "/knowledge", icon: BookOpen },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Integrations", href: "/settings", icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-[#0d1326] text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-slate-800/80 z-30">
      {/* Brand & Logo Header */}
      <div>
        <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="w-4 h-4 text-indigo-100" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider text-white">
                NEXIO<span className="text-indigo-400">24</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-indigo-300 font-semibold -mt-1">
                Ops Platform
              </span>
            </div>
          </Link>

          <Link
            href="/"
            title="View Customer Website"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-indigo-900/50 text-indigo-300 border border-indigo-700/50"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Card */}
      <div className="p-3 border-t border-slate-800/80">
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={
                admin?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              }
              alt="Admin Profile"
              className="w-9 h-9 rounded-full object-cover ring-1 ring-indigo-500/50 shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate">
                {admin?.name || "Admin User"}
              </h4>
              <span className="text-[10px] text-indigo-400 block font-medium -mt-0.5 truncate">
                {admin?.email || "admin@nexio24.com"}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
