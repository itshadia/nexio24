"use client";

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedRooms from "./components/FeaturedRooms";
import ServicesAndTech from "./components/ServicesAndTech";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import ChatWidget from "./components/chat/ChatWidget";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [activePrompt, setActivePrompt] = useState<string | undefined>(undefined);

  const handleOpenChatWithPrompt = (prompt: string) => {
    setActivePrompt(prompt);
    setChatOpen(true);
  };

  const handleSelectRoom = (roomName: string, price: number) => {
    handleOpenChatWithPrompt(
      `Hi, I'm interested in booking the ${roomName} ($${price}/night). Can you check availability for this weekend?`
    );
  };

  const handleTriggerSupport = (issuePrompt: string) => {
    handleOpenChatWithPrompt(issuePrompt);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <Navbar onOpenChat={() => setChatOpen(true)} />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero Section with Live Booking Bar */}
        <Hero onOpenChatWithPrompt={handleOpenChatWithPrompt} />

        {/* Featured Rooms & Suites (Deluxe Room $120/night, Tech Suite, Penthouse) */}
        <FeaturedRooms onSelectRoom={handleSelectRoom} />

        {/* Smart Living & 24/7 Technical Support Operations */}
        <ServicesAndTech onTriggerSupportChat={handleTriggerSupport} />

        {/* Verified Guest Reviews & Hospitality Ratings */}
        <Testimonials />
      </main>

      {/* Site Footer */}
      <Footer />

      {/* Interactive AI Concierge Chat Box Widget */}
      <ChatWidget
        isOpen={chatOpen}
        onToggleOpen={setChatOpen}
        initialPrompt={activePrompt}
      />
    </div>
  );
}
