"use client";

import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Ali Khan",
      title: "Business Traveler & Tech Executive",
      stay: "Executive Tech Suite",
      quote:
        "Nexio24 is years ahead of typical luxury hotels. I requested room service and a quiet workspace via the chat assistant, and everything was arranged flawlessly within minutes.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    {
      name: "Sarah Ahmed",
      title: "Design Consultant",
      stay: "Deluxe Room ($120/night)",
      quote:
        "The booking process was effortless. When I needed to modify my checkout date, the operations system handled the policy check and confirmation instantly. Zero hold times!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    },
    {
      name: "Hassan Raza",
      title: "Conference Attendee",
      stay: "Deluxe Room (Room 204)",
      quote:
        "My AC needed a quick calibration on arrival. I submitted a quick note via the widget, and engineering arrived within 10 minutes to fine-tune it. Exceptional hospitality support.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
  ];

  return (
    <section id="reviews" className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">
            Guest Satisfaction
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Loved by Travelers and Professionals
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Read firsthand experiences from guests who appreciate prompt service, pristine accommodations, and intelligent in-room care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-slate-50/60 rounded-2xl p-7 border border-slate-200/70 flex flex-col justify-between relative hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/50 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    {rev.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </h4>
                  <span className="text-xs text-indigo-600 font-medium block">
                    {rev.stay}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

