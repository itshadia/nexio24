"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Bot, ShieldCheck, Menu, X, ArrowUpRight, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import CustomerAuthModal from "./auth/CustomerAuthModal";

interface NavbarProps {
  onOpenChat?: () => void;
}

export default function Navbar({ onOpenChat }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { customer } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-indigo-100" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-wider text-slate-900 font-sans flex items-center gap-1">
                  NEXIO<span className="text-indigo-600">24</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400 -mt-1">
                  Hospitality & Operations
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
              <a href="#rooms" className="hover:text-indigo-600 transition-colors">
                Suites & Rooms
              </a>
              <a href="#amenities" className="hover:text-indigo-600 transition-colors">
                Smart Living
              </a>
              <a href="#support" className="hover:text-indigo-600 transition-colors">
                24/7 Tech Support
              </a>
              <a href="#reviews" className="hover:text-indigo-600 transition-colors">
                Guest Reviews
              </a>
            </nav>

            {/* Action CTAs */}
            <div className="hidden md:flex items-center gap-3">
              {/* Customer / Guest Profile Pill */}
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {customer ? customer.name.charAt(0) : <User className="w-3 h-3" />}
                </div>
                <span className="max-w-[110px] truncate">
                  {customer ? customer.name : "Guest Sign In"}
                </span>
                {customer?.room && (
                  <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                    {customer.room.replace("Room ", "R")}
                  </span>
                )}
              </button>

              {onOpenChat && (
                <button
                  onClick={onOpenChat}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/60 rounded-full transition-all cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI Concierge</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </button>
              )}

              {/* Staff / Operations Admin Link */}
              <Link
                href="/dashboard"
                className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Staff Portal</span>
              </Link>

              <a
                href="#booking"
                className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 hover:shadow-md transition-all"
              >
                <span>Book a Stay</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="p-1.5 text-xs font-semibold rounded-full bg-slate-100 border border-slate-200 text-slate-700"
              >
                <User className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
            <a
              href="#rooms"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-700 hover:text-indigo-600 font-medium py-2"
            >
              Suites & Rooms
            </a>
            <a
              href="#amenities"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-700 hover:text-indigo-600 font-medium py-2"
            >
              Smart Living
            </a>
            <a
              href="#support"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-700 hover:text-indigo-600 font-medium py-2"
            >
              24/7 Tech Support
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-700 hover:text-indigo-600 font-medium py-2"
            >
              Guest Reviews
            </a>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
              >
                <User className="w-4 h-4" />
                <span>Guest Profile ({customer?.name || "Sign In"})</span>
              </button>
              {onOpenChat && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenChat();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg"
                >
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <span>Talk to AI Concierge</span>
                </button>
              )}
              <Link
                href="/dashboard"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
              >
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <span>Staff & Operations Portal</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Customer Auth / Persona Modal */}
      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
