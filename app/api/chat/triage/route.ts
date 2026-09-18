import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

interface TriageResult {
  is_issue: boolean;
  intent: "inquiry" | "maintenance" | "booking" | "refund" | "support" | "general";
  category: "Booking" | "Maintenance" | "Refund" | "Support" | "General";
  priority: "Low" | "Medium" | "High" | "Critical";
  create_ticket: boolean;
  requires_human_approval: boolean;
  ticket_subject: string;
  approval_action?: "issue_refund" | "dispatch_technician" | "room_upgrade";
  approval_reason?: string;
  approval_amount?: number;
  ai_reply: string;
  card?: {
    title: string;
    price: string;
    image: string;
    details: string;
    badge?: string;
    actionText?: string;
  };
}

const isValidUUID = (id: any): boolean =>
  typeof id === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

// 1. Intelligent Fallback Classifier (Dynamic, non-static)
function analyzeWithHeuristics(
  userMessage: string,
  guestName: string,
  guestRoom: string
): TriageResult {
  const lower = userMessage.toLowerCase();

  // Refund / Financial Dispute
  if (
    lower.includes("refund") ||
    lower.includes("compensation") ||
    lower.includes("money back") ||
    lower.includes("charge back") ||
    lower.includes("compensate") ||
    lower.includes("dispute")
  ) {
    const amountMatch = userMessage.match(/\$?(\d+(\.\d{1,2})?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 100;

    return {
      is_issue: true,
      intent: "refund",
      category: "Refund",
      priority: "High",
      create_ticket: true,
      requires_human_approval: true,
      ticket_subject: `Refund Request ($${amount}) - ${guestRoom || "Room"}`,
      approval_action: "issue_refund",
      approval_reason: `Guest requested refund: "${userMessage.slice(0, 80)}"`,
      approval_amount: amount,
      ai_reply: `Hello ${guestName}, I have officially registered your refund request for $${amount}. A priority approval notification has been forwarded to our Operations Manager for immediate review.`,
    };
  }

  // Room Maintenance / Physical Appliance / Cleaning Issue
  if (
    lower.includes("ac") ||
    lower.includes("air condition") ||
    lower.includes("cooling") ||
    lower.includes("heat") ||
    lower.includes("leak") ||
    lower.includes("plumbing") ||
    lower.includes("shower") ||
    lower.includes("water") ||
    lower.includes("keycard") ||
    lower.includes("tv") ||
    lower.includes("wifi") ||
    lower.includes("broken") ||
    lower.includes("dirty") ||
    lower.includes("towel") ||
    lower.includes("pillow") ||
    lower.includes("blanket") ||
    lower.includes("clean") ||
    lower.includes("maintenance")
  ) {
    const isUrgent = lower.includes("leak") || lower.includes("flood") || lower.includes("urgent");
    return {
      is_issue: true,
      intent: "maintenance",
      category: "Maintenance",
      priority: isUrgent ? "Critical" : "High",
      create_ticket: true,
      requires_human_approval: false,
      ticket_subject: `${guestRoom || "Room"} Maintenance: ${userMessage.slice(0, 45)}`,
      ai_reply: `Hello ${guestName}, I have immediately dispatched our facilities team for ${guestRoom || "your room"}. An engineer is on duty and will attend to this within 15 minutes.`,
    };
  }

  // Booking / Reservation Inquiries
  if (
    lower.includes("book") ||
    lower.includes("availability") ||
    lower.includes("reserve") ||
    lower.includes("suite") ||
    (lower.includes("room") && lower.includes("price"))
  ) {
    return {
      is_issue: false,
      intent: "booking",
      category: "Booking",
      priority: "Medium",
      create_ticket: false,
      requires_human_approval: false,
      ticket_subject: "Suite Booking Inquiry",
      ai_reply: `Hello ${guestName}! We have our premier luxury suites available. Would you like to reserve our Deluxe King Suite with panoramic skyline views and complimentary gourmet breakfast?`,
      card: {
        title: "Deluxe King Suite",
        price: "$140/night",
        image:
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
        details: "King bed · Panoramic Skyline View · Breakfast Included",
        badge: "Available Today",
        actionText: "Reserve This Suite",
      },
    };
  }

  // Hotel Policies / Amenities
  if (
    lower.includes("pool") ||
    lower.includes("gym") ||
    lower.includes("timing") ||
    lower.includes("breakfast") ||
    lower.includes("checkout") ||
    lower.includes("check in") ||
    lower.includes("check-in") ||
    lower.includes("restaurant")
  ) {
    let answer = "Our hotel amenities are open daily for your stay.";
    if (lower.includes("pool") || lower.includes("gym")) {
      answer = "Our heated infinity pool and 24/7 fitness center are open daily from 6:00 AM to 11:00 PM.";
    } else if (lower.includes("breakfast")) {
      answer = "Gourmet buffet breakfast is served at the Sky Lounge from 7:00 AM to 10:30 AM daily.";
    } else if (lower.includes("check")) {
      answer = "Standard check-in begins at 3:00 PM and check-out is at 11:00 AM. Keyless mobile check-in is available anytime!";
    }

    return {
      is_issue: false,
      intent: "inquiry",
      category: "General",
      priority: "Low",
      create_ticket: false,
      requires_human_approval: false,
      ticket_subject: "Hotel Amenities Inquiry",
      ai_reply: `Hello ${guestName}! ${answer} Let me know if you would like me to arrange anything for you!`,
    };
  }

  // Conversational response
  return {
    is_issue: false,
    intent: "general",
    category: "General",
    priority: "Low",
    create_ticket: false,
    requires_human_approval: false,
    ticket_subject: "Guest Conversation",
    ai_reply: `Hello ${guestName}! I am your 24/7 AI Concierge here at Nexio24. How can I assist you with ${guestRoom || "your room"}, services, or questions today?`,
  };
}

// 2. Google Gemini LLM Caller (Iterates models for high availability)
async function callGeminiTriage(
  apiKey: string,
  userMessage: string,
  guestName: string,
  guestRoom: string
): Promise<TriageResult | null> {
  // Use verified responsive model names
  const models = [
    "gemini-flash-lite-latest",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
  ];

  const prompt = `You are the AI Concierge and Operations Triage Assistant for Nexio24 luxury hotel.
A guest (${guestName || "Guest"}, Room: ${guestRoom || "Guest Room"}) sent this message:
"${userMessage}"

Analyze this message and return a JSON object with:
- "is_issue": (boolean) true if the guest is reporting a problem, maintenance request, room service, complaint, or asking for items/refund.
- "intent": ("inquiry" | "maintenance" | "booking" | "refund" | "support" | "general")
- "category": ("Booking" | "Maintenance" | "Refund" | "Support" | "General")
- "priority": ("Low" | "Medium" | "High" | "Critical")
- "create_ticket": (boolean) true if hotel staff need to take action or if an operational ticket should be logged.
- "requires_human_approval": (boolean) true if guest requests refund, financial compensation, or room changes.
- "ticket_subject": (string) Brief 4-7 word title of the request.
- "approval_action": ("issue_refund" or null)
- "approval_reason": (string or null)
- "approval_amount": (number or null)
- "ai_reply": (string) 1-3 natural, warm, personalized sentences addressing the guest by name (${guestName}) answering their query or confirming staff action.

Return ONLY the raw JSON object with no markdown formatting.`;

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        }
      );

      if (!res.ok) {
        continue;
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned) as TriageResult;
      return parsed;
    } catch {
      continue;
    }
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, customer, ticketId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const guestName = customer?.name || "Guest";
    const guestRoom = customer?.room || "Guest Suite";
    const guestEmail = customer?.email || "guest@nexio24.com";
    const customerId = customer?.id;
    const validCustomerId = isValidUUID(customerId) ? customerId : null;

    // Run AI analysis
    const geminiKey = process.env.GEMINI_API_KEY;
    let triage: TriageResult | null = null;

    if (geminiKey && geminiKey !== "your-gemini-api-key") {
      triage = await callGeminiTriage(geminiKey, message, guestName, guestRoom);
    }

    if (!triage) {
      triage = analyzeWithHeuristics(message, guestName, guestRoom);
    }

    // 1. Find or create the active Ticket in Supabase
    let activeTicket: any = null;

    if (ticketId && isValidUUID(ticketId)) {
      const { data: existing } = await supabaseAdmin
        .from("tickets")
        .select("*")
        .eq("id", ticketId)
        .single();
      activeTicket = existing;
    }

    if (!activeTicket) {
      const ticketNumber = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;
      const { data: newTicket, error: ticketError } = await supabaseAdmin
        .from("tickets")
        .insert({
          ticket_number: ticketNumber,
          channel: "chat",
          customer_id: validCustomerId,
          customer_name: guestName,
          customer_email: guestEmail,
          customer_room: guestRoom,
          subject: triage.ticket_subject || `Concierge Chat: ${message.slice(0, 40)}`,
          category: triage.category.toLowerCase(),
          priority: triage.priority.toLowerCase(),
          status: triage.requires_human_approval
            ? "escalated"
            : triage.create_ticket
            ? "open"
            : "resolved",
          metadata: {
            source: "ai_concierge_widget",
            intent: triage.intent,
            is_issue: triage.is_issue,
            requires_human_approval: triage.requires_human_approval,
          },
        })
        .select("*")
        .single();

      if (!ticketError) {
        activeTicket = newTicket;
      } else {
        console.error("Error creating ticket in Supabase:", ticketError);
      }
    } else if (triage.is_issue) {
      // Escalate / update active ticket if new issue is logged
      await supabaseAdmin
        .from("tickets")
        .update({
          subject: triage.ticket_subject,
          category: triage.category.toLowerCase(),
          priority: triage.priority.toLowerCase(),
          status: triage.requires_human_approval ? "escalated" : "open",
        })
        .eq("id", activeTicket.id);
    }

    // 2. Persist inbound & outbound messages in Supabase messages table
    if (activeTicket?.id) {
      await supabaseAdmin.from("messages").insert([
        {
          ticket_id: activeTicket.id,
          direction: "inbound",
          sender: "customer",
          sender_name: guestName,
          body: message,
        },
        {
          ticket_id: activeTicket.id,
          direction: "outbound",
          sender: "ai_agent",
          sender_name: "Nexio24 AI Concierge",
          body: triage.ai_reply,
        },
      ]);
    }

    // 3. If High Risk / Refund: Persist into Supabase approvals table
    // 3. If High Risk / Maintenance / Refund: Persist into Supabase approvals table
    if (triage.requires_human_approval && activeTicket?.id) {
      const isRefund = triage.category?.toLowerCase() === "refund" || triage.intent === "refund";
      const action = triage.approval_action || (isRefund ? "issue_refund" : "dispatch_technician");
      const reason =
        triage.approval_reason ||
        (isRefund
          ? "Guest requested refund/compensation"
          : `Guest requested room maintenance / repair: "${message.slice(0, 60)}"`);

      const payload: any = {
        guest_name: guestName,
        guest_room: guestRoom,
        complaint: message,
      };

      if (isRefund || triage.approval_amount) {
        payload.amount = triage.approval_amount || 100;
      }

      await supabaseAdmin.from("approvals").insert({
        ticket_id: activeTicket.id,
        action,
        reason,
        proposed_payload: payload,
        status: "pending",
      });
    }

    return NextResponse.json({
      success: true,
      ai_reply: triage.ai_reply,
      is_issue: triage.is_issue,
      category: triage.category,
      priority: triage.priority,
      card: triage.card,
      ticket: activeTicket
        ? {
            id: activeTicket.id,
            ticket_number: activeTicket.ticket_number,
            category: triage.category,
            priority: triage.priority,
            status: activeTicket.status === "escalated" ? "Escalated" : triage.create_ticket ? "Open" : "Resolved",
            create_ticket: triage.create_ticket,
          }
        : null,
      approval_required: triage.requires_human_approval,
    });
  } catch (err: any) {
    console.error("Triage API error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}