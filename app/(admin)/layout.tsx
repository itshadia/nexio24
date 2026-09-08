"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { admin, loading } = useAuth();

  useEffect(() => {
    // If auth state finished loading and no admin is signed in, redirect to /login
    if (!loading && !admin) {
      router.push("/login");
    }
  }, [admin, loading, router]);

  // Loading state while checking Supabase session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
            Verifying Admin Session...
          </span>
        </div>
      </div>
    );
  }

  // If not authenticated, prevent flash of admin content while redirecting
  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      {/* Dark Navy Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
