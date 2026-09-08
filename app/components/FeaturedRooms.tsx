"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Wifi,
  Coffee,
  Tv,
  Maximize,
  Sparkles,
  ArrowRight,
  Shield,
  Star,
  Check,
} from "lucide-react";

export interface RoomItem {
  id: string;
  name: string;
  tier: string;
  price: number;
  originalPrice?: number;
  image: string;
  capacity: string;
  size: string;
  bed: string;
  badge?: string;
  amenities: string[];
  description: string;
}

export const ROOMS_DATA: RoomItem[] = [
  {
    id: "deluxe-room",
    name: "Deluxe Room",
    tier: "Signature Comfort",
    price: 120,
    originalPrice: 150,
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
    capacity: "2 Guests",
    size: "38 m²",
    bed: "King Bed",
    badge: "Most Popular",
    amenities: [
      "King bed with Egyptian cotton",
      "Ultra-fast Wi-Fi (Gigabit)",
      "Complimentary gourmet breakfast",
      "Smart voice-controlled lighting & AC",
    ],
    description:
      "Our hallmark Deluxe Room blends plush hospitality with seamless room automation, featuring a dedicated workspace, walk-in rain shower, and personalized temperature settings.",
  },
  {
    id: "executive-suite",
    name: "Executive Tech Suite",
    tier: "Business & Premium",
    price: 240,
    originalPrice: 290,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
    capacity: "2-3 Guests",
    size: "62 m²",
    bed: "California King",
    badge: "Skyline View",
    amenities: [
      "Panoramic skyline balcony",
      "Ergonomic workstation & dual 4K monitors",
      "Smart mini-bar with app replenishment",
      "Acoustic noise isolation technology",
    ],
    description:
      "Tailored for discerning travelers and executives, featuring a separate living salon, enterprise Wi-Fi 6, automated motorized shades, and bespoke evening lounge access.",
  },
  {
    id: "presidential-penthouse",
    name: "Presidential Penthouse",
    tier: "Ultra Luxury",
    price: 450,
    originalPrice: 550,
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80",
    capacity: "4 Guests",
    size: "120 m²",
    bed: "2 Master King Suites",
    badge: "VIP Exclusive",
    amenities: [
      "Private outdoor terrace & heated plunge pool",
      "Dedicated 24/7 AI Butler & Head Concierge",
      "Private dining area & chef on request",
      "Complimentary VIP airport transfer",
    ],
    description:
      "The pinnacle of Nexio24 luxury. Spanning top-tier architecture with breathtaking 360-degree vistas, private elevator access, and tailored hospitality concierge services.",
  },
];

interface FeaturedRoomsProps {
  onSelectRoom?: (roomName: string, price: number) => void;
}

export default function FeaturedRooms({ onSelectRoom }: FeaturedRoomsProps) {
  const [selectedRoomModal, setSelectedRoomModal] = useState<RoomItem | null>(null);

  return (
    <section id="rooms" className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">
              Accommodations
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Curated Suites Crafted for Rest & Precision
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              Every room at Nexio24 is equipped with smart IoT climate controls, silent acoustic framing, and instant digital assistance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Prices include taxes & fees</span>
          </div>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ROOMS_DATA.map((room) => (
            <div
              key={room.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {room.badge && (
                  <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    {room.badge}
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white px-3 py-1 rounded-lg text-xs font-semibold">
                  {room.bed}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                      {room.tier}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>4.9</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">{room.name}</h3>
                  <p className="text-slate-600 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {room.description}
                  </p>

                  {/* Amenities List */}
                  <div className="space-y-2 mb-6">
                    {room.amenities.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-slate-900">${room.price}</span>
                      <span className="text-xs text-slate-500 font-medium">/ night</span>
                    </div>
                    {room.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ${room.originalPrice}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedRoomModal(room)}
                      className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => onSelectRoom?.(room.name, room.price)}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inquire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Details Modal */}
      {selectedRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-up border border-slate-100">
            <div className="relative h-56 w-full">
              <img
                src={selectedRoomModal.image}
                alt={selectedRoomModal.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedRoomModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase">
                    {selectedRoomModal.tier}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {selectedRoomModal.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">
                    ${selectedRoomModal.price}
                  </span>
                  <span className="text-xs text-slate-500 block">per night</span>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                {selectedRoomModal.description}
              </p>

              <div className="space-y-2 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Included Amenities & Smart Perks
                </h4>
                {selectedRoomModal.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedRoomModal(null)}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const r = selectedRoomModal;
                    setSelectedRoomModal(null);
                    onSelectRoom?.(r.name, r.price);
                  }}
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Book with AI Concierge</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

