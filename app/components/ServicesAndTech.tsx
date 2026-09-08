"use client";

import React from "react";
import {
  Wrench,
  Wifi,
  Wind,
  ShieldCheck,
  Zap,
  Clock,
  Smartphone,
  Headphones,
  Car,
  Utensils,
} from "lucide-react";

interface ServicesAndTechProps {
  onTriggerSupportChat?: (issueTopic: string) => void;
}

export default function ServicesAndTech({ onTriggerSupportChat }: ServicesAndTechProps) {
  const techFeatures = [
    {
      icon: Wind,
      title: "Smart Climate & AC Automation",
      description:
        "Every suite is fitted with intelligent dual-zone thermostats. Adjust room climate via app or prompt our concierge for instant adjustments.",
      actionPrompt: "My AC is not cooling properly in room 204. Can maintenance check it?",
    },
    {
      icon: Wifi,
      title: "Dedicated Gigabit Wi-Fi 6",
      description:
        "Ultra-low latency wireless networks configured for seamless 4K video conferencing, remote work, and private VLAN security.",
      actionPrompt: "How do I connect my device to the private guest high-speed network?",
    },
    {
      icon: Wrench,
      title: "Sub-15 Minute Maintenance SLA",
      description:
        "Our in-house technical engineering team is dispatched instantly whenever hardware or room amenity issues are flagged.",
      actionPrompt: "I need immediate maintenance assistance in my room.",
    },
    {
      icon: Smartphone,
      title: "Keyless Mobile Entry",
      description:
        "NFC smartphone door access and self-service automated check-in / check-out directly through encrypted digital keys.",
      actionPrompt: "Can I do mobile keyless check-in for my arrival today?",
    },
    {
      icon: Car,
      title: "Private Airport Transfers",
      description:
        "Premium chauffeur and executive electric fleet available 24/7 for punctual airport pick-up and city dispatch.",
      actionPrompt: "I want to schedule an airport pickup service for tomorrow.",
    },
    {
      icon: Utensils,
      title: "Automated In-Room Dining",
      description:
        "Farm-to-table culinary menus ordered directly with automated dietary customization and guaranteed delivery countdowns.",
      actionPrompt: "What is available on the late-night in-room dining menu?",
    },
  ];

  return (
    <section id="amenities" className="py-24 bg-slate-50/70 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">
            Smart Living & Technical Support
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Integrated Comfort Powered by Rapid Operations
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Nexio24 is more than accommodation. We combine hospitality with active technical infrastructure so your stay is uninterrupted.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    AI-Monitored
                  </span>
                  <button
                    onClick={() => onTriggerSupportChat?.(feat.actionPrompt)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Request Assistance</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support Banner */}
        <div
          id="support"
          className="mt-16 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-96 h-full bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Zero Downtime Hospitality</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Encountering an issue in your suite?
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Whether it's temperature recalibration, Wi-Fi pairing, or urgent room maintenance, 
                our AI operations agent triages requests in under 3 seconds and dispatches staff immediately.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() =>
                  onTriggerSupportChat?.(
                    "Hello, my AC is not cooling properly in room 204. Can an engineer be dispatched?"
                  )
                }
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Wrench className="w-4 h-4" />
                <span>Report Room 204 Issue</span>
              </button>

              <button
                onClick={() =>
                  onTriggerSupportChat?.(
                    "Can you tell me about your cancellation and refund policy?"
                  )
                }
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Ask Policy / Refund</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

