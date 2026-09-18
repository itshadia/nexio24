import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get("ticketId");

    // If a specific ticketId is requested, return full messages for that ticket
    if (ticketId) {
      const { data: ticket, error: ticketError } = await supabaseAdmin
        .from("tickets")
        .select("*")
        .eq("id", ticketId)
        .single();

      if (ticketError || !ticket) {
        return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
      }

      const { data: messages, error: msgError } = await supabaseAdmin
        .from("messages")
        .select("*")
        .eq("ticket_id", ticket.id)
        .order("created_at", { ascending: true });

      return NextResponse.json({
        success: true,
        ticket,
        messages: messages || [],
      });
    }

    // Otherwise, fetch all conversations (tickets + latest message)
    const { data: tickets, error: ticketsError } = await supabaseAdmin
      .from("tickets")
      .select("*")
      .order("updated_at", { ascending: false });

    if (ticketsError) {
      console.error("Error fetching tickets for inbox:", ticketsError);
      return NextResponse.json({ success: true, conversations: [] });
    }

    // Fetch latest messages for each ticket
    const ticketIds = (tickets || []).map((t) => t.id);
    let messagesByTicket: Record<string, any[]> = {};

    if (ticketIds.length > 0) {
      const { data: allMessages } = await supabaseAdmin
        .from("messages")
        .select("*")
        .in("ticket_id", ticketIds)
        .order("created_at", { ascending: true });

      if (allMessages) {
        for (const msg of allMessages) {
          if (!messagesByTicket[msg.ticket_id]) {
            messagesByTicket[msg.ticket_id] = [];
          }
          messagesByTicket[msg.ticket_id].push(msg);
        }
      }
    }

    const conversations = (tickets || []).map((t) => {
      const msgs = messagesByTicket[t.id] || [];
      const lastMsg = msgs[msgs.length - 1];
      const customerMsgs = msgs.filter((m) => m.direction === "inbound" || m.sender === "customer");
      const primaryInbound = customerMsgs[customerMsgs.length - 1]?.body || t.subject || "No message content";

      // Formatted time
      const timeDate = new Date(lastMsg?.created_at || t.updated_at || t.created_at);
      const isToday = new Date().toDateString() === timeDate.toDateString();
      const formattedTime = isToday
        ? timeDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : timeDate.toLocaleDateString([], { month: "short", day: "numeric" });

      let statusDisplay: "Open" | "Resolved" | "In Progress" | "Escalated" = "Open";
      if (t.status === "resolved") statusDisplay = "Resolved";
      else if (t.status === "in_progress") statusDisplay = "In Progress";
      else if (t.status === "escalated") statusDisplay = "Escalated";

      return {
        id: t.id,
        ticketNumber: t.ticket_number,
        customerName: t.customer_name || "Valued Guest",
        email: t.customer_email || "guest@nexio24.com",
        room: t.customer_room || "Room",
        subject: t.subject,
        lastMessage: lastMsg?.body || primaryInbound,
        time: formattedTime,
        status: statusDisplay,
        category: t.category,
        priority: t.priority,
        messageCount: msgs.length,
        hasAiReply: msgs.some((m) => m.sender === "ai_agent"),
        hasStaffReply: msgs.some((m) => m.sender === "staff"),
      };
    });

    return NextResponse.json({
      success: true,
      conversations,
    });
  } catch (err: any) {
    console.error("Inbox GET error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ticketId, message, statusChange, adminName } = body;

    if (!ticketId) {
      return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
    }

    const staffName = adminName || "Hadia Asghar (Admin)";
    let newMessage = null;

    // 1. Insert outbound staff message if provided
    if (message && typeof message === "string" && message.trim()) {
      const { data: insertedMsg, error: msgError } = await supabaseAdmin
        .from("messages")
        .insert({
          ticket_id: ticketId,
          direction: "outbound",
          sender: "staff",
          sender_name: staffName,
          body: message.trim(),
        })
        .select("*")
        .single();

      if (msgError) {
        console.error("Error inserting inbox message:", msgError);
        return NextResponse.json({ error: msgError.message }, { status: 500 });
      }
      newMessage = insertedMsg;
    }

    // 2. Update ticket status / timestamp
    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (statusChange) {
      if (statusChange === "Resolved") updatePayload.status = "resolved";
      else if (statusChange === "Open") updatePayload.status = "open";
      else if (statusChange === "In Progress") updatePayload.status = "in_progress";
      else if (statusChange === "Escalated") updatePayload.status = "escalated";
    }

    const { data: updatedTicket, error: ticketError } = await supabaseAdmin
      .from("tickets")
      .update(updatePayload)
      .eq("id", ticketId)
      .select("*")
      .single();

    if (ticketError) {
      console.error("Error updating ticket from inbox:", ticketError);
    }

    // 3. Log to audit_logs
    try {
      if (message || statusChange) {
        await supabaseAdmin.from("audit_logs").insert({
          action: statusChange ? "ticket_status_updated" : "staff_message_sent",
          entity_type: "ticket",
          entity_id: ticketId,
          details: {
            admin: staffName,
            status: statusChange,
            messageSnippet: message ? message.slice(0, 80) : null,
          },
        });
      }
    } catch (e) {}

    return NextResponse.json({
      success: true,
      newMessage,
      updatedTicket,
    });
  } catch (err: any) {
    console.error("Inbox POST error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

