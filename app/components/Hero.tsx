"use client";

import React, { useState } from "react";
import {
  Calendar,
  Users,
  Search,
  Sparkles,
  Bot,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface HeroProps {
  onOpenChatWithPrompt?: (prompt: string) => void;
}

export default function Hero({ onOpenChatWithPrompt }: HeroProps) {
  const [checkIn, setCheckIn] = useState("2026-09-12");
  const [checkOut, setCheckOut] = useState("2026-09-15");
  const [guests, setGuests] = useState("2 Guests");
  const [roomType, setRoomType] = useState("Deluxe Room");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOpenChatWithPrompt) {
      onOpenChatWithPrompt(
        `Hi, I'd like to check availability for a ${roomType} from ${checkIn} to ${checkOut} for ${guests}.`
      );
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-indigo-100/60 via-purple-50/40 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-semibold mb-6 shadow-xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Next-Gen Smart Living & Hospitality</span>
            <span className="h-3 w-px bg-indigo-200" />
            <span className="text-slate-600 font-normal">24/7 Automated Support</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            Where Modern Luxury Meets{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 bg-clip-text text-transparent">
              Intelligent Care
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed mb-10">
            Welcome to Nexio24. Enjoy five-star suites with integrated smart room controls, 
            instant booking assistance, and sub-15-minute maintenance dispatch powered by AI operations.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <a
              href="#rooms"
              className="px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center gap-2"
            >
              <span>Explore Accommodations</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() =>
                onOpenChatWithPrompt?.(
                  "Hi! What rooms do you have available for next Friday?"
                )
              }
              className="px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl shadow-xs hover:border-slate-300 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-indigo-600" />
              <span>Ask AI Concierge</span>
            </button>
          </div>
        </div>

        {/* Quick Booking & Availability Card */}
        <div
          id="booking"
          className="max-w-5xl mx-auto bg-white rounded-2xl p-4 sm:p-6 shadow-xl shadow-slate-200/60 border border-slate-100"
        >
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
          >
            {/* Check-In */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>Check-in</span>
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full text-sm font-medium px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 bg-slate-50/50"
              />
            </div>

            {/* Check-Out */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>Check-out</span>
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full text-sm font-medium px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 bg-slate-50/50"
              />
            </div>

            {/* Guests */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Guests</span>
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full text-sm font-medium px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 bg-slate-50/50"
              >
                <option value="1 Guest">1 Guest</option>
                <option value="2 Guests">2 Guests</option>
                <option value="3 Guests">3 Guests</option>
                <option value="4+ Family Suite">4+ Family Suite</option>
              </select>
            </div>

            {/* Room Preference */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Suite Tier</span>
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full text-sm font-medium px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 bg-slate-50/50"
              >
                <option value="Deluxe Room">Deluxe Room ($120/nt)</option>
                <option value="Executive Tech Suite">Executive Tech Suite ($240/nt)</option>
                <option value="Presidential Penthouse">Presidential Penthouse ($450/nt)</option>
              </select>
            </div>

            {/* Search Button */}
            <div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm shadow-indigo-200 hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Check Rates</span>
              </button>
            </div>
          </form>

          {/* Quick guarantees below search */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Best Rate Guarantee with Instant Booking
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Free Cancellation up to 24 Hours Prior
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Smart Keyless Mobile Check-In
            </span>
          </div>
        </div>

        {/* Feature Highlights Banner */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-xs text-center">
            <span className="block text-2xl font-bold text-slate-900">4.9 ★</span>
            <span className="text-xs text-slate-500 font-medium">Guest Satisfaction</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-xs text-center">
            <span className="block text-2xl font-bold text-indigo-600">&lt; 15 min</span>
            <span className="text-xs text-slate-500 font-medium">Rapid Maintenance SLA</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-xs text-center">
            <span className="block text-2xl font-bold text-slate-900">24 / 7</span>
            <span className="text-xs text-slate-500 font-medium">AI Concierge & Staff</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-xs text-center">
            <span className="block text-2xl font-bold text-emerald-600">100%</span>
            <span className="text-xs text-slate-500 font-medium">High-Speed Wi-Fi</span>
          </div>
        </div>
      </div>
    </section>
  );
}

