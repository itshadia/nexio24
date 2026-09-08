"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Bot,
  Layers,
  Cpu,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Lock,
  Mail,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@nexio24.com");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // 1. Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error || !data.user) {
        setErrorMsg(error?.message || "Invalid login credentials.");
        setLoading(false);
        return;
      }

      // 2. Query public.profiles to verify admin role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, role, name")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile || profile.role !== "admin") {
        await supabase.auth.signOut();
        setErrorMsg("Access Denied: This account is not an administrator.");
        setLoading(false);
        return;
      }

      // 3. Successful Admin verification -> redirect to Dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during authentication.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 font-sans">
      {/* Left Brand Showcase */}
      <div className="lg:w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-14 lg:p-20 flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <span className="text-2xl font-black tracking-wider text-white">
              NEXIO<span className="text-indigo-400">24</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 py-12 max-w-lg">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.15] mb-5">
            AI Agents for <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
              Real Business Impact
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-10">
            Automate. Assist. Operate. Across hospitality, maintenance, customer support, and more.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <Bot className="w-5 h-5 text-indigo-300" />
              <div>
                <h3 className="font-bold text-sm text-white">AI-Powered Automation</h3>
                <p className="text-xs text-slate-400">Instant triage, RAG retrieval, and autonomous resolution.</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <Layers className="w-5 h-5 text-purple-300" />
              <div>
                <h3 className="font-bold text-sm text-white">Multi-Agent Systems</h3>
                <p className="text-xs text-slate-400">Specialized triage, booking, and technical support agents.</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <Cpu className="w-5 h-5 text-blue-300" />
              <div>
                <h3 className="font-bold text-sm text-white">Integrations Made Simple</h3>
                <p className="text-xs text-slate-400">Native n8n workflows, Supabase PostgreSQL, and LLM APIs.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Smarter Operations. Happier Customers.</span>
          <Link href="/" className="hover:text-white transition-colors">
            ← Back to Customer Website
          </Link>
        </div>
      </div>

      {/* Right Login Form (STRICTLY LOGIN ONLY) */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Restricted Access</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Portal</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Sign in with your authorized administrator credentials
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAdminSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nexio24.com"
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              {loading ? (
                <span>Authenticating with Supabase...</span>
              ) : (
                <>
                  <span>Sign In as Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Admin access is restricted to authorized personnel. Role-based security enforced via Supabase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}