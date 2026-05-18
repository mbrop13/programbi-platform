import { NextRequest, NextResponse } from "next/server";
import { sendNewMemberNotification } from "@/lib/email/mailersend";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "name and email required" }, { status: 400 });
    }

    await sendNewMemberNotification({ name, email, phone });
    console.log("✅ New member notification sent for:", name, email);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ New member notification error:", err?.message, err?.stack);
    // Don't fail the registration — just log the error
    return NextResponse.json({ success: false, error: err?.message }, { status: 200 });
  }
}
