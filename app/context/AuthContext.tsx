"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  room?: string;
  phone?: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  customer: CustomerUser | null;
  loading: boolean;
  signOutAdmin: () => Promise<void>;
  signInCustomer: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signUpCustomer: (data: {
    name: string;
    email: string;
    password: string;
    room?: string;
    phone?: string;
  }) => Promise<{
    success: boolean;
    needsEmailConfirmation?: boolean;
    error?: string;
  }>;
  signOutCustomer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync Supabase Auth session for both Admin and Customer
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, name, email, role, room, phone")
            .eq("id", session.user.id)
            .single();

          if (profile && (profile.role === "admin" || profile.role === "staff")) {
            setAdmin({
              id: profile.id,
              name: profile.name || "Admin User",
              email: profile.email || session.user.email || "",
              role: profile.role,
              avatar:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            });
            setCustomer(null);
          } else {
            // Customer persona
            setCustomer({
              id: session.user.id,
              name:
                profile?.name ||
                session.user.user_metadata?.name ||
                session.user.email?.split("@")[0] ||
                "Guest",
              email: profile?.email || session.user.email || "",
              room:
                profile?.room ||
                session.user.user_metadata?.room ||
                "Guest Suite",
              phone:
                profile?.phone ||
                session.user.user_metadata?.phone ||
                "",
            });
            setAdmin(null);
          }
        } else {
          setAdmin(null);
          setCustomer(null);
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes (login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, name, email, role, room, phone")
            .eq("id", session.user.id)
            .single();

          if (profile && (profile.role === "admin" || profile.role === "staff")) {
            setAdmin({
              id: profile.id,
              name: profile.name || "Admin User",
              email: profile.email || session.user.email || "",
              role: profile.role,
              avatar:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            });
            setCustomer(null);
          } else {
            // Customer persona
            setCustomer({
              id: session.user.id,
              name:
                profile?.name ||
                session.user.user_metadata?.name ||
                session.user.email?.split("@")[0] ||
                "Guest",
              email: profile?.email || session.user.email || "",
              room:
                profile?.room ||
                session.user.user_metadata?.room ||
                "Guest Suite",
              phone:
                profile?.phone ||
                session.user.user_metadata?.phone ||
                "",
            });
            setAdmin(null);
          }
        } else {
          setAdmin(null);
          setCustomer(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOutAdmin = async () => {
    await supabase.auth.signOut();
    setAdmin(null);
  };

  const signInCustomer = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        return {
          success: false,
          error: error?.message || "Invalid credentials. Please verify email and password.",
        };
      }

      // Fetch customer profile details
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, name, email, role, room, phone")
        .eq("id", data.user.id)
        .single();

      const user: CustomerUser = {
        id: data.user.id,
        name:
          profile?.name ||
          data.user.user_metadata?.name ||
          email.split("@")[0],
        email: profile?.email || data.user.email || email.trim(),
        room:
          profile?.room ||
          data.user.user_metadata?.room ||
          "Guest Suite",
        phone:
          profile?.phone ||
          data.user.user_metadata?.phone ||
          "",
      };

      setCustomer(user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "An authentication error occurred." };
    }
  };

  const signUpCustomer = async (data: {
    name: string;
    email: string;
    password: string;
    room?: string;
    phone?: string;
  }): Promise<{
    success: boolean;
    needsEmailConfirmation?: boolean;
    error?: string;
  }> => {
    try {
      const cleanEmail = data.email.trim().toLowerCase();

      // 1. Call server API to create and auto-confirm user in Supabase
      const res = await fetch("/api/auth/customer-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: cleanEmail,
          password: data.password,
          room: data.room?.trim() || "Guest Suite",
          phone: data.phone?.trim() || "",
        }),
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        return {
          success: false,
          error: result.error || "Could not register account. Please try again.",
        };
      }

      // 2. Immediately sign in the guest to create the Supabase client session
      const { data: signInData, error: signInErr } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: data.password,
        });

      if (signInErr || !signInData.user) {
        // Fallback: If sign in threw an error, user is registered
        return { success: true, needsEmailConfirmation: false };
      }

      const user: CustomerUser = {
        id: result.user.id,
        name: result.user.name,
        email: cleanEmail,
        room: result.user.room,
        phone: result.user.phone,
      };
      setCustomer(user);

      return { success: true, needsEmailConfirmation: false };
    } catch (err: any) {
      return { success: false, error: err?.message || "An error occurred during registration." };
    }
  };

  const signOutCustomer = async () => {
    await supabase.auth.signOut();
    setCustomer(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        customer,
        loading,
        signOutAdmin,
        signInCustomer,
        signUpCustomer,
        signOutCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}