"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Bot,
  User,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  RotateCw,
  MessageSquare,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import AdminHeader from "../../components/admin/AdminHeader";

interface Conversation {
  id: string;
  ticketNumber: string;
  customerName: string;
  email: string;
  room?: string;
  subject?: string;
  lastMessage: string;
  time: string;
  status: "Open" | "Resolved" | "In Progress" | "Escalated";
  category?: string;
  priority?: string;
  messageCount: number;
  hasAiReply?: boolean;
  hasStaffReply?: boolean;
}

interface Message {
  id: string;
  ticket_id: string;
  direction: "inbound" | "outbound" | "internal";
  sender: "customer" | "ai_agent" | "staff";
  sender_name?: string;
  body: string;
  metadata?: any;
  created_at: string;
}

const INITIAL_MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    ticketNumber: "TICK-1245",
    customerName: "Hassan Raza",
    email: "hassan.raza@email.com",
    room: "Room 204",
    lastMessage: "The AC in room 204 is not working.",
    time: "10:25 AM",
    status: "Open",
    messageCount: 3,
    hasAiReply: true,
  },
  {
    id: "conv-2",
    ticketNumber: "TICK-1244",
    customerName: "Sarah Ahmed",
    email: "sarah.ahmed@email.com",
    room: "Room 108",
    lastMessage: "Can you tell me about your cancellation policy?",
    time: "12 mins ago",
    status: "Open",
    messageCount: 2,
    hasAiReply: true,
  },
  {
    id: "conv-3",
    ticketNumber: "TICK-1243",
    customerName: "Ali Khan",
    email: "ali.khan@email.com",
    room: "Deluxe Suite 312",
    lastMessage: "Yes, please show me the options with prices.",
    time: "35 mins ago",
    status: "Open",
    messageCount: 4,
    hasAiReply: true,
  },
  {
    id: "conv-4",
    ticketNumber: "TICK-1242",
    customerName: "Zara Malik",
    email: "zara.malik@email.com",
    room: "Executive Suite 501",
    lastMessage: "Do you have airport pickup service?",
    time: "1 hour ago",
    status: "Open",
    messageCount: 2,
    hasAiReply: true,
  },
  {
    id: "conv-5",
    ticketNumber: "TICK-1241",
    customerName: "Bilal Qureshi",
    email: "bilal.q@email.com",
    lastMessage: "What are your check-in timings?",
    time: "2 hours ago",
    status: "Resolved",
    messageCount: 2,
    hasAiReply: true,
  },
];

const QUICK_SMART_REPLIES = [
  "Our engineering specialist is on the way to your room right now.",
  "Your request has been reviewed and approved by management.",
  "Breakfast is served daily from 7:00 AM to 10:30 AM at The Grand Verandah.",
  "Our front desk has updated your reservation preferences. Please let us know if you need anything else.",
];

export default function InboxPage() {
  const [filterTab, setFilterTab] = useState<"All" | "Open" | "Resolved">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newReply, setNewReply] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1. Fetch conversations list
  const fetchConversations = useCallback(async (selectIdAfter?: string) => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/inbox");
      const data = await res.json();

      if (data.success && data.conversations && data.conversations.length > 0) {
        setConversations(data.conversations);
        if (selectIdAfter) {
          setSelectedConvId(selectIdAfter);
        } else if (!selectedConvId || !data.conversations.some((c: Conversation) => c.id === selectedConvId)) {
          setSelectedConvId(data.conversations[0].id);
        }
      } else {
        setConversations(INITIAL_MOCK_CONVERSATIONS);
        if (!selectedConvId) {
          setSelectedConvId(INITIAL_MOCK_CONVERSATIONS[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching inbox conversations:", err);
      setConversations(INITIAL_MOCK_CONVERSATIONS);
      if (!selectedConvId) {
        setSelectedConvId(INITIAL_MOCK_CONVERSATIONS[0].id);
      }
    } finally {
      setLoadingList(false);
    }
  }, [selectedConvId]);

  useEffect(() => {
    fetchConversations();
  }, []);

  // 2. Fetch message thread for selected conversation
  const fetchThread = useCallback(async (convId: string) => {
    if (!convId) return;
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/inbox?ticketId=${encodeURIComponent(convId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.messages) {
          setMessages(data.messages);
          setLoadingMessages(false);
          return;
        }
      }

      // Mock fallback if demo ticket
      const mockConv = INITIAL_MOCK_CONVERSATIONS.find((c) => c.id === convId);
      if (mockConv) {
        setMessages([
          {
            id: `mock-1-${convId}`,
            ticket_id: convId,
            direction: "inbound",
            sender: "customer",
            sender_name: mockConv.customerName,
            body: mockConv.lastMessage,
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: `mock-2-${convId}`,
            ticket_id: convId,
            direction: "outbound",
            sender: "ai_agent",
            sender_name: "Nexio24 AI Concierge",
            body: `Hello ${mockConv.customerName}, I have registered your message and informed our operations desk.`,
            created_at: new Date(Date.now() - 3000000).toISOString(),
          },
        ]);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Error fetching message thread:", err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (selectedConvId) {
      fetchThread(selectedConvId);
    }
  }, [selectedConvId, fetchThread]);

  const activeConv =
    conversations.find((c) => c.id === selectedConvId) || conversations[0] || null;

  // Filtered list
  const filteredConversations = conversations.filter((c) => {
    if (filterTab === "Open" && c.status === "Resolved") return false;
    if (filterTab === "Resolved" && c.status !== "Resolved") return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = c.customerName.toLowerCase().includes(q);
      const matchEmail = c.email.toLowerCase().includes(q);
      const matchRoom = (c.room || "").toLowerCase().includes(q);
      const matchMsg = c.lastMessage.toLowerCase().includes(q);
      const matchTicket = (c.ticketNumber || "").toLowerCase().includes(q);
      return matchName || matchEmail || matchRoom || matchMsg || matchTicket;
    }
    return true;
  });

  // 3. Send new message as staff
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || newReply).trim();
    if (!text || !activeConv || sending) return;

    setSending(true);
    setNewReply("");

    try {
      const res = await fetch("/api/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: activeConv.id,
          message: text,
          adminName: "Hadia Asghar (Admin)",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.newMessage) {
        setMessages((prev) => [...prev, data.newMessage]);

        // Update last message in conversation list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConv.id
              ? {
                  ...c,
                  lastMessage: text,
                  time: "Just now",
                  hasStaffReply: true,
                  messageCount: c.messageCount + 1,
                }
              : c
          )
        );
      } else {
        // Local simulation if demo ticket
        const localMsg: Message = {
          id: `local-${Date.now()}`,
          ticket_id: activeConv.id,
          direction: "outbound",
          sender: "staff",
          sender_name: "Hadia Asghar (Admin)",
          body: text,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, localMsg]);
      }
    } catch (err) {
      console.error("Error sending reply:", err);
    } finally {
      setSending(false);
    }
  };

  // 4. Toggle Status (Resolve / Reopen)
  const handleToggleStatus = async () => {
    if (!activeConv) return;
    const nextStatus = activeConv.status === "Resolved" ? "Open" : "Resolved";

    try {
      const res = await fetch("/api/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: activeConv.id,
          statusChange: nextStatus,
          adminName: "Hadia Asghar (Admin)",
        }),
      });

      if (res.ok) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConv.id ? { ...c, status: nextStatus } : c
          )
        );
      }
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <AdminHeader
        title="Live Support Inbox"
        subtitle="Omni-channel conversation triage, AI live stream & staff co-pilot"
      />

      <div className="flex-1 flex overflow-hidden max-h-[calc(100vh-64px)]">
        {/* Left List of Conversations */}
        <div className="w-80 sm:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0">
          {/* Top Search & Filter Tabs */}
          <div className="p-4 border-b border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Conversations</h2>
                <button
                  onClick={() => fetchConversations()}
                  disabled={loadingList}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Refresh conversations"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${loadingList ? "animate-spin text-indigo-600" : ""}`} />
                </button>
              </div>
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
                placeholder="Search guest, room, or message..."
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

          {/* Conversation Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingList && conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                <RotateCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-600" />
                <span>Loading conversations...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No conversations found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedConvId;
                const isResolved = conv.status === "Resolved";
                const isEscalated = conv.status === "Escalated";

                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50/70 border-l-4 border-indigo-600"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    {/* Avatar with initial */}
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      {conv.customerName ? conv.customerName.charAt(0).toUpperCase() : "G"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
                          <span>{conv.customerName}</span>
                          {conv.ticketNumber && (
                            <span className="font-mono text-[10px] text-indigo-600 font-semibold">
                              {conv.ticketNumber}
                            </span>
                          )}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {conv.time}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 truncate mb-1.5">
                        {conv.lastMessage}
                      </p>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Status Badge */}
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isResolved
                              ? "bg-slate-100 text-slate-600"
                              : isEscalated
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {conv.status}
                        </span>

                        {/* Room Badge */}
                        {conv.room && (
                          <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-100">
                            {conv.room}
                          </span>
                        )}

                        {/* Handling Badge */}
                        {conv.hasStaffReply ? (
                          <span className="text-[9px] text-purple-700 font-bold flex items-center gap-0.5">
                            <UserCheck className="w-3 h-3" />
                            <span>Staff</span>
                          </span>
                        ) : conv.hasAiReply ? (
                          <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>AI</span>
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Message Thread */}
        <div className="flex-1 flex flex-col bg-slate-50 min-w-0">
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {activeConv.customerName ? activeConv.customerName.charAt(0).toUpperCase() : "G"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {activeConv.customerName}
                      </h3>
                      <span className="text-xs text-slate-400">({activeConv.email})</span>
                      {activeConv.room && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">
                          {activeConv.room}
                        </span>
                      )}
                      {activeConv.ticketNumber && (
                        <span className="font-mono text-xs text-indigo-600 font-bold">
                          {activeConv.ticketNumber}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] font-medium flex items-center gap-1.5">
                      {activeConv.hasStaffReply ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                          <span className="text-purple-700 font-semibold">Staff Takeover Active</span>
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-emerald-700">AI Concierge Handling Active</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Toggle Button */}
                  <button
                    onClick={handleToggleStatus}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                      activeConv.status === "Resolved"
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
                        : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {activeConv.status === "Resolved" ? "Reopen Ticket" : "Mark as Resolved"}
                    </span>
                  </button>

                  {/* Link to Full Ticket Investigation */}
                  {activeConv.ticketNumber && (
                    <Link
                      href={`/tickets/${encodeURIComponent(activeConv.ticketNumber.replace("#", ""))}`}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-indigo-100"
                      title="Open full AI audit & tool executions"
                    >
                      <span>Investigate</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full text-xs text-slate-400">
                    <RotateCw className="w-5 h-5 animate-spin mr-2 text-indigo-600" />
                    <span>Loading conversation history...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-xs text-slate-400 space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-300" />
                    <p>No messages recorded yet for this ticket.</p>
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const isInbound = m.direction === "inbound" || m.sender === "customer";
                    const isStaff = m.sender === "staff";
                    const timeStr = m.created_at
                      ? new Date(m.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Recently";

                    if (isInbound) {
                      // Guest Message (Aligned Right)
                      return (
                        <div key={m.id || idx} className="flex flex-col items-end">
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                            <span className="font-semibold text-slate-600">
                              {m.sender_name || activeConv.customerName}
                            </span>
                            <span>•</span>
                            <span>{timeStr}</span>
                          </div>
                          <div className="max-w-lg bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-xs text-xs sm:text-sm shadow-xs leading-relaxed font-sans whitespace-pre-wrap">
                            {m.body}
                          </div>
                        </div>
                      );
                    }

                    if (isStaff) {
                      // Staff / Admin Message (Aligned Left, Purple/Indigo theme)
                      return (
                        <div key={m.id || idx} className="flex flex-col items-start">
                          <div className="flex items-center gap-1.5 text-[11px] text-purple-700 mb-1 font-bold">
                            <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xs">
                              <ShieldCheck className="w-3 h-3" />
                            </div>
                            <span>{m.sender_name || "Hadia Asghar (Admin)"}</span>
                            <span className="text-slate-400 font-normal">•</span>
                            <span className="text-slate-400 font-normal text-[10px]">{timeStr}</span>
                          </div>
                          <div className="max-w-lg bg-purple-50/80 border border-purple-200 text-purple-950 p-3.5 rounded-2xl rounded-tl-xs text-xs sm:text-sm shadow-xs leading-relaxed font-sans whitespace-pre-wrap">
                            {m.body}
                          </div>
                        </div>
                      );
                    }

                    // AI Concierge Message (Aligned Left, Emerald theme)
                    return (
                      <div key={m.id || idx} className="flex flex-col items-start">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mb-1">
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                            <Bot className="w-3 h-3" />
                          </div>
                          <span className="font-bold text-emerald-800">
                            {m.sender_name || "Nexio24 AI Concierge"}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-400 text-[10px]">{timeStr}</span>
                        </div>
                        <div className="max-w-lg bg-white border border-slate-200 text-slate-800 p-3.5 rounded-2xl rounded-tl-xs text-xs sm:text-sm shadow-xs leading-relaxed font-sans whitespace-pre-wrap">
                          {m.body}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Smart Replies Bar */}
              <div className="px-6 py-2 bg-slate-100 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Smart Reply:
                </span>
                {QUICK_SMART_REPLIES.map((replyText, i) => (
                  <button
                    key={i}
                    onClick={() => setNewReply(replyText)}
                    className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
                  >
                    {replyText.length > 38 ? `${replyText.slice(0, 38)}...` : replyText}
                  </button>
                ))}
              </div>

              {/* Message Input Footer */}
              <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
                <input
                  type="text"
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a staff reply to guest... (Press Enter to send)"
                  disabled={sending}
                  className="flex-1 text-xs sm:text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 placeholder-slate-400"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={sending || !newReply.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl shadow-xs font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {sending ? (
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Send</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm">
              <MessageSquare className="w-10 h-10 mb-2 text-slate-300" />
              <p>Select a conversation from the left to view messages</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
