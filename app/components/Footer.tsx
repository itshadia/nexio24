"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Phone, Mail, MapPin, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-wider text-white">
                NEXIO<span className="text-indigo-400">24</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Nexio24 combines premier luxury hospitality with 24/7 AI-orchestrated guest operations and technical support.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Open Operations Admin</span>
              </Link>
            </div>
          </div>

          {/* Suites & Stays */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase text-[11px]">
              Suites & Residences
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#rooms" className="hover:text-white transition-colors">
                  Deluxe Room ($120/night)
                </a>
              </li>
              <li>
                <a href="#rooms" className="hover:text-white transition-colors">
                  Executive Tech Suite
                </a>
              </li>
              <li>
                <a href="#rooms" className="hover:text-white transition-colors">
                  Presidential Penthouse
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-white transition-colors">
                  Check Current Rates
                </a>
              </li>
            </ul>
          </div>

          {/* Guest Services & Tech Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase text-[11px]">
              Operations & Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#support" className="hover:text-white transition-colors">
                  24/7 In-Room Tech Support
                </a>
              </li>
              <li>
                <a href="#amenities" className="hover:text-white transition-colors">
                  Rapid Maintenance SLA
                </a>
              </li>
              <li>
                <a href="#amenities" className="hover:text-white transition-colors">
                  Smart Mobile Keyless Entry
                </a>
              </li>
              <li>
                <a href="#amenities" className="hover:text-white transition-colors">
                  Private Airport Transfers
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Emergency Desk */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase text-[11px]">
              Concierge Desk
            </h4>
            <div className="space-y-2.5">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>+1 (800) 459-NEXIO</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>support@nexio24.com</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>Nexio Landmark Tower, Grand Boulevard</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Nexio24 Hospitality & Tech Operations. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </a>
            <a href="#security" className="hover:text-slate-400 transition-colors">
              Security & Guardrails
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

