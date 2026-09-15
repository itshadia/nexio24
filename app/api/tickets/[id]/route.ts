import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

const isValidUUID = (id: any): boolean =>
  typeof id === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

async function findTicket(idParam: string) {
  const cleanId = decodeURIComponent(idParam).replace(/^#/, "").trim();

  let query = supabaseAdmin.from("tickets").select("*");
  if (isValidUUID(cleanId)) {
    query = query.or(`id.eq.${cleanId},ticket_number.eq.${cleanId},ticket_number.eq.#${cleanId}`);
  } else {
    query = query.or(`ticket_number.eq.${cleanId},ticket_number.eq.#${cleanId}`);
  }

  const { data: ticket, error } = await query.maybeSingle();
  if (error || !ticket) return null;
  return ticket;
}

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const ticket = await findTicket(params.id);

    if (!ticket) {
      return NextResponse.json({ success: false, notFound: true }, { status: 404 });
    }

    const { data: messages } = await supabaseAdmin
      .from("messages")
      .select("*")
      .eq("ticket_id", ticket.id)
      .order("created_at", { ascending: true });

    const { data: approvals } = await supabaseAdmin
      .from("approvals")
      .select("*")
      .eq("ticket_id", ticket.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      success: true,
      ticket,
      messages: messages || [],
      approvals: approvals || [],
    });
  } catch (err: any) {
    console.error("Fetch ticket error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const ticket = await findTicket(params.id);

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const body = await req.json();
    const { action, replyMessage, adminName } = body;
    const authorName = adminName || "Hadia Asghar (Admin)";

    if (action === "approve") {
      // 1. Mark pending approval as approved
      await supabaseAdmin
        .from("approvals")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
        })
        .eq("ticket_id", ticket.id)
        .eq("status", "pending");

      // 2. Update ticket status to in_progress
      await supabaseAdmin
        .from("tickets")
        .update({
          status: "in_progress",
          updated_at: new Date().toISOString(),
        })
        .eq("id", ticket.id);

      // 3. Post outbound reply message if provided
      let newMessage = null;
      if (replyMessage && typeof replyMessage === "string") {
        const { data: insertedMsg } = await supabaseAdmin
          .from("messages")
          .insert({
            ticket_id: ticket.id,
            direction: "outbound",
            sender: "staff",
            sender_name: authorName,
            body: replyMessage,
          })
          .select("*")
          .single();
        newMessage = insertedMsg;
      }

      // 4. Record audit log
      try {
        await supabaseAdmin.from("audit_logs").insert({
          action: "human_approved",
          entity_type: "ticket",
          entity_id: ticket.id,
          details: { approved_by: authorName, message: replyMessage },
        });
      } catch (e) {
        // Continue if audit_log fails
      }

      return NextResponse.json({
        success: true,
        message: "Ticket approved and reply dispatched",
        ticketStatus: "in_progress",
        newMessage,
      });
    }

    if (action === "resolve") {
      // Update ticket status to resolved
      await supabaseAdmin
        .from("tickets")
        .update({
          status: "resolved",
          updated_at: new Date().toISOString(),
        })
        .eq("id", ticket.id);

      let newMessage = null;
      if (replyMessage && typeof replyMessage === "string") {
        const { data: insertedMsg } = await supabaseAdmin
          .from("messages")
          .insert({
            ticket_id: ticket.id,
            direction: "outbound",
            sender: "staff",
            sender_name: authorName,
            body: replyMessage,
          })
          .select("*")
          .single();
        newMessage = insertedMsg;
      }

      try {
        await supabaseAdmin.from("audit_logs").insert({
          action: "ticket_resolved",
          entity_type: "ticket",
          entity_id: ticket.id,
          details: { resolved_by: authorName },
        });
      } catch (e) {}

      return NextResponse.json({
        success: true,
        message: "Ticket marked as resolved",
        ticketStatus: "resolved",
        newMessage,
      });
    }

    if (action === "escalate") {
      // Escalate ticket priority to critical and status to escalated
      await supabaseAdmin
        .from("tickets")
        .update({
          status: "escalated",
          priority: "critical",
          updated_at: new Date().toISOString(),
        })
        .eq("id", ticket.id);

      try {
        await supabaseAdmin.from("audit_logs").insert({
          action: "ticket_escalated",
          entity_type: "ticket",
          entity_id: ticket.id,
          details: { escalated_by: authorName },
        });
      } catch (e) {}

      return NextResponse.json({
        success: true,
        message: "Ticket escalated to critical priority",
        ticketStatus: "escalated",
        ticketPriority: "critical",
      });
    }

    if (action === "send_reply") {
      if (!replyMessage || typeof replyMessage !== "string") {
        return NextResponse.json({ error: "Reply message is required" }, { status: 400 });
      }

      const { data: insertedMsg, error: msgError } = await supabaseAdmin
        .from("messages")
        .insert({
          ticket_id: ticket.id,
          direction: "outbound",
          sender: "staff",
          sender_name: authorName,
          body: replyMessage,
        })
        .select("*")
        .single();

      if (msgError) {
        return NextResponse.json({ error: msgError.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Reply sent",
        newMessage: insertedMsg,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    console.error("Ticket action error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

