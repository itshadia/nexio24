"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  RotateCcw,
  User,
  ChevronDown,
  ShieldAlert,
} from "lucide-react";
import ChatMessage from "./ChatMessage";
import {
  MessageItem,
  QUICK_PROMPTS,
  getAIResponse,
} from "./chatData";
import { useAuth } from "../../context/AuthContext";

interface ChatWidgetProps {
  initialPrompt?: string;
  isOpen?: boolean;
  onToggleOpen?: (open: boolean) => void;
}

export default function ChatWidget({
  initialPrompt,
  isOpen: controlledIsOpen,
  onToggleOpen,
}: ChatWidgetProps) {
  const { customer } = useAuth();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const setIsOpen = (open: boolean) => {
    if (onToggleOpen) {
      onToggleOpen(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "welcome-1",
      sender: "agent",
      senderName: "Nexio24 AI Concierge",
      timestamp: "Just now",
      text: `Hello ${customer ? customer.name : "there"}! Welcome to Nexio24. I am your 24/7 AI Concierge & Operations Assistant.`,
    },
    {
      id: "welcome-2",
      sender: "agent",
      senderName: "Nexio24 AI Concierge",
      timestamp: "Just now",
      text: "How can I help you today? You can inquire about our luxury suites, report an in-room maintenance issue, or check our policies.",
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Handle external prompt trigger
  useEffect(() => {
    if (initialPrompt) {
      setIsOpen(true);
      sendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const sendMessage = (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query) return;

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      sender: "user",
      senderName: customer?.name || "Guest",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Simulate realistic AI Agent latency (600ms - 950ms)
    setTimeout(() => {
      const responseData = getAIResponse(query);

      const agentMsg: MessageItem = {
        id: `agent-${Date.now()}`,
        sender: "agent",
        senderName: "Nexio24 AI Agent",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: responseData.replyText,
        card: responseData.card,
        ticketId: responseData.ticketId,
        category: responseData.category,
        priority: responseData.priority,
        status: responseData.status,
      };

      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 750);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "agent",
        senderName: "Nexio24 AI Concierge",
        timestamp: "Just now",
        text: `Conversation refreshed. How may I assist you ${customer ? customer.name : ""} with your stay or inquiries today?`,
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Floating Toggle Button (When Closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-white/20"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-indigo-700 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-xs font-semibold tracking-wide block">
              Nexio AI Concierge
            </span>
            {customer && (
              <span className="text-[10px] text-indigo-200 block -mt-0.5">
                {customer.name}
              </span>
            )}
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
            24/7 Live
          </span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-scale-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-indigo-900/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-wide">Nexio24 AI Concierge</h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 font-semibold">
                    Ops Agent
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1">
                  <span>Sub-3s Response</span>
                  <span>•</span>
                  <span>Direct Escalation</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <button
                onClick={handleReset}
                title="Restart chat"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Guest Info Bar */}
          <div className="bg-indigo-50/90 border-b border-indigo-100/90 px-4 py-1.5 flex items-center justify-between text-[11px] text-indigo-900 font-medium">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Guest: <strong>{customer ? customer.name : "Unregistered Guest"}</strong></span>
              {customer?.room && (
                <span className="text-indigo-600 font-semibold">({customer.room})</span>
              )}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Connected
            </span>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 space-y-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onSelectCardAction={(cardText) => sendMessage(cardText)}
              />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-2 animate-fade-in">
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-2xl border border-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Pills */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(prompt)}
                className="whitespace-nowrap text-[11px] font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 px-2.5 py-1 rounded-full transition-colors shrink-0 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about rooms, AC issues, policies..."
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-800 placeholder-slate-400"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!inputVal.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
