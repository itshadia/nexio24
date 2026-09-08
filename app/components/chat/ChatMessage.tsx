"use client";

import React from "react";
import { Bot, User, Sparkles, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import { MessageItem } from "./chatData";

interface ChatMessageProps {
  message: MessageItem;
  onSelectCardAction?: (cardTitle: string) => void;
}

export default function ChatMessage({
  message,
  onSelectCardAction,
}: ChatMessageProps) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
          isUser
            ? "bg-slate-900 text-white"
            : "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble Content */}
      <div className={`max-w-[85%] space-y-2 ${isUser ? "items-end" : "items-start"}`}>
        {/* Header (Agent label & timestamp) */}
        <div
          className={`flex items-center gap-2 text-[11px] text-slate-400 ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          <span className="font-semibold text-slate-600">
            {isUser ? "You" : "Nexio24 AI Agent"}
          </span>
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Text Bubble */}
        <div
          className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
            isUser
              ? "bg-indigo-600 text-white rounded-tr-xs"
              : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs"
          }`}
        >
          {message.text}
        </div>

        {/* Optional Ticket Creation Badge */}
        {message.ticketId && !isUser && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] font-semibold text-indigo-700">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Operations Ticket {message.ticketId}</span>
            {message.category && (
              <span className="px-1.5 py-0.5 rounded bg-indigo-100/70 text-indigo-800 text-[10px]">
                {message.category}
              </span>
            )}
            {message.priority && (
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  message.priority === "High"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {message.priority}
              </span>
            )}
          </div>
        )}

        {/* Rich Room Card (Directly matching Screen 3 in the user's mockup!) */}
        {message.card && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden max-w-xs mt-2 transition-all hover:border-indigo-300">
            <div className="relative h-32 w-full bg-slate-100 overflow-hidden">
              <img
                src={message.card.image}
                alt={message.card.title}
                className="w-full h-full object-cover"
              />
              {message.card.badge && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                  {message.card.badge}
                </span>
              )}
            </div>

            <div className="p-3.5">
              <div className="flex items-baseline justify-between mb-1">
                <h4 className="font-bold text-slate-900 text-sm">
                  {message.card.title}
                </h4>
                <span className="font-extrabold text-indigo-600 text-sm">
                  {message.card.price}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 mb-3">
                {message.card.details}
              </p>

              <button
                onClick={() =>
                  onSelectCardAction?.(
                    `I want to confirm booking for ${message.card?.title} at ${message.card?.price}`
                  )
                }
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{message.card.actionText || "View Details"}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

