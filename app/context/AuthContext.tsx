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
  signInCustomer: (email: string, password?: string) => Promise<boolean>;
  signUpCustomer: (data: {
    name: string;
    email: string;
    password?: string;
    room?: string;
    phone?: string;
  }) => Promise<boolean>;
  signOutCustomer: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync Supabase Auth session for Admin
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, name, email, role")
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
          }
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
            .select("id, name, email, role")
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
          }
        } else {
          setAdmin(null);
        }
        setLoading(false);
      }
    );

    // Restore guest/customer session from localStorage if present
    if (typeof window !== "undefined") {
      const savedCustomer = localStorage.getItem("nexio_active_customer");
      if (savedCustomer) {
        try {
          setCustomer(JSON.parse(savedCustomer));
        } catch {
          // ignore corrupted data
        }
      }
    }

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOutAdmin = async () => {
    await supabase.auth.signOut();
    setAdmin(null);
  };

  const signInCustomer = async (email: string) => {
    let existingName = email.split("@")[0].replace(".", " ");
    existingName = existingName.charAt(0).toUpperCase() + existingName.slice(1);

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nexio_registered_customers");
      if (stored) {
        try {
          const list = JSON.parse(stored);
          const found = list.find(
            (u: any) => u.email.toLowerCase() === email.toLowerCase()
          );
          if (found) existingName = found.name;
        } catch {}
      }
    }

    const user: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: existingName,
      email: email.toLowerCase(),
      room: "Guest Room",
    };

    setCustomer(user);
    if (typeof window !== "undefined") {
      localStorage.setItem("nexio_active_customer", JSON.stringify(user));
    }
    return true;
  };

  const signUpCustomer = async (data: {
    name: string;
    email: string;
    password?: string;
    room?: string;
    phone?: string;
  }) => {
    const newUser: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      room: data.room?.trim() || "Guest Suite",
      phone: data.phone?.trim() || "",
    };

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nexio_registered_customers");
      const list = stored ? JSON.parse(stored) : [];
      list.push(newUser);
      localStorage.setItem("nexio_registered_customers", JSON.stringify(list));
      localStorage.setItem("nexio_active_customer", JSON.stringify(newUser));
    }

    setCustomer(newUser);
    return true;
  };

  const signOutCustomer = () => {
    setCustomer(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("nexio_active_customer");
    }
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