"use client";

import React, { useState } from "react";
import {
  Search,
  Bot,
  User,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  MoreVertical,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import AdminHeader from "../../components/admin/AdminHeader";

interface Conversation {
  id: string;
  customerName: string;
  email: string;
  room?: string;
  lastMessage: string;
  time: string;
  status: "Open" | "Resolved";
  unread?: boolean;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    customerName: "Ali Khan",
    email: "ali.khan@email.com",
    room: "Deluxe Suite 312",
    lastMessage: "Yes, please show me the options with prices.",
    time: "10:25 AM",
    status: "Open",
  },
  {
    id: "conv-2",
    customerName: "Sarah Ahmed",
    email: "sarah.ahmed@email.com",
    room: "Room 108",
    lastMessage: "Can you tell me about your cancellation policy?",
    time: "12 mins ago",
    status: "Open",
    unread: true,
  },
  {
    id: "conv-3",
    customerName: "Hassan Raza",
    email: "hassan.raza@email.com",
    room: "Room 204",
    lastMessage: "The AC in room 204 is not working.",
    time: "35 mins ago",
    status: "Open",
    unread: true,
  },
  {
    id: "conv-4",
    customerName: "Zara Malik",
    email: "zara.malik@email.com",
    room: "Executive Suite 501",
    lastMessage: "Do you have airport pickup service?",
    time: "1 hour ago",
    status: "Open",
  },
  {
    id: "conv-5",
    customerName: "Bilal Qureshi",
    email: "bilal.q@email.com",
    lastMessage: "What are your check-in timings?",
    time: "2 hours ago",
    status: "Resolved",
  },
  {
    id: "conv-6",
    customerName: "Ayesha Noor",
    email: "ayesha.n@email.com",
    lastMessage: "Thanks for your help!",
    time: "3 hours ago",
    status: "Resolved",
  },
  {
    id: "conv-7",
    customerName: "Usman Tariq",
    email: "usman.t@email.com",
    lastMessage: "Can I modify my reservation?",
    time: "5 hours ago",
    status: "Open",
  },
  {
    id: "conv-8",
    customerName: "Fatima Ali",
    email: "fatima.ali@email.com",
    lastMessage: "Do you offer group discounts?",
    time: "1 day ago",
    status: "Resolved",
  },
];

export default function InboxPage() {
  const [filterTab, setFilterTab] = useState<"All" | "Open" | "Resolved">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConvId, setSelectedConvId] = useState<string>("conv-1");
  const [newReply, setNewReply] = useState("");

  const activeConv =
    INITIAL_CONVERSATIONS.find((c) => c.id === selectedConvId) ||
    INITIAL_CONVERSATIONS[0];

  const filteredConversations = INITIAL_CONVERSATIONS.filter((c) => {
    if (filterTab !== "All" && c.status !== filterTab) return false;
    if (
      searchQuery &&
      !c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <>
      <AdminHeader
        title="Support Inbox"
        subtitle="Live conversation triage & human co-pilot"
      />

      <div className="flex-1 flex overflow-hidden max-h-[calc(100vh-64px)]">
        {/* Left List of Conversations */}
        <div className="w-80 sm:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0">
          {/* Top Search & Filter Tabs */}
          <div className="p-4 border-b border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Conversations</h2>
              <span className="text-xs font-semibold text-slate-400">
                {filteredConversations.length} chats
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder-slate-400"
              />
            </div>

            {/* Filter Tabs: All, Open, Resolved */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(["All", "Open", "Resolved"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    filterTab === tab
                      ? "bg-white text-indigo-600 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === selectedConvId;
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`w-full p-4 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50/60 border-l-4 border-indigo-600"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                    {conv.customerName.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {conv.customerName}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {conv.time}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 truncate mb-1">
                      {conv.lastMessage}
                    </p>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                          conv.status === "Open"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {conv.status}
                      </span>
                      {conv.room && (
                        <span className="text-[10px] text-indigo-600 font-medium">
                          {conv.room}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Message Thread */}
        <div className="flex-1 flex flex-col bg-slate-50 min-w-0">
          {/* Thread Header */}
          <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                {activeConv.customerName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    {activeConv.customerName}
                  </h3>
                  <span className="text-xs text-slate-400">({activeConv.email})</span>
                  {activeConv.room && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                      {activeConv.room}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>AI Agent Handling Active</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                {activeConv.status}
              </span>
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream (Directly mirroring Screen 3 in the mockup) */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {/* Customer Message 1 */}
            <div className="flex flex-col items-end">
              <div className="max-w-lg bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-xs text-xs sm:text-sm shadow-xs">
                Hi, I'd like to book a room for next Friday. Do you have availability?
              </div>
              <span className="text-[10px] text-slate-400 mt-1">10:24 AM</span>
            </div>

            {/* AI Agent Message 1 */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Bot className="w-3 h-3" />
                </div>
                <span className="font-bold text-slate-700">Nexio AI Agent</span>
                <span>•</span>
                <span>10:24 AM</span>
              </div>
              <div className="max-w-lg bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-xs text-xs sm:text-sm text-slate-800 shadow-xs">
                Yes! We have several rooms available for next Friday. Would you like me to share the options?
              </div>
            </div>

            {/* Customer Message 2 */}
            <div className="flex flex-col items-end">
              <div className="max-w-lg bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-xs text-xs sm:text-sm shadow-xs">
                Yes, please show me the options with prices.
              </div>
              <span className="text-[10px] text-slate-400 mt-1">10:25 AM</span>
            </div>

            {/* AI Agent Message 2 with Deluxe Room Card */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Bot className="w-3 h-3" />
                </div>
                <span className="font-bold text-slate-700">Nexio AI Agent</span>
                <span>•</span>
                <span>10:26 AM</span>
              </div>

              {/* Rich Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden max-w-sm">
                <div className="relative h-40 w-full bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80"
                    alt="Deluxe Room"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    Available Now
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <h4 className="font-bold text-slate-900 text-base">Deluxe Room</h4>
                    <span className="font-extrabold text-indigo-600 text-base">
                      $120/night
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-4">
                    King bed · Free Wifi · Breakfast included
                  </p>

                  <button className="w-full py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                    <span>View Details & Book</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Message Input Footer */}
          <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
            <input
              type="text"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Type a human reply or staff note..."
              className="flex-1 text-xs sm:text-sm px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 placeholder-slate-400"
            />
            <button
              onClick={() => setNewReply("")}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

