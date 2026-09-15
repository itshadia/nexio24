import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, room, phone } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Full Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanRoom = room?.trim() || "Guest Suite";
    const cleanPhone = phone?.trim() || "";

    // 1. Create user via Supabase Admin API with auto email confirmation
    const { data: userData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: cleanEmail,
        password: password,
        email_confirm: true,
        user_metadata: {
          name: cleanName,
          role: "customer",
          room: cleanRoom,
          phone: cleanPhone,
        },
      });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!userData.user) {
      return NextResponse.json(
        { error: "Failed to create user account." },
        { status: 500 }
      );
    }

    // 2. Ensure profile exists in public.profiles
    await supabaseAdmin.from("profiles").upsert({
      id: userData.user.id,
      name: cleanName,
      email: cleanEmail,
      role: "customer",
      room: cleanRoom,
      phone: cleanPhone,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: userData.user.id,
        email: cleanEmail,
        name: cleanName,
        room: cleanRoom,
        phone: cleanPhone,
      },
    });
  } catch (err: any) {
    console.error("Customer registration route error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}