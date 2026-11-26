import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getUserId } from "@/lib/auth";

export async function GET() {
  try {
    const id = await getUserId();
    if (!id) return NextResponse.json({ user: null });

    await connectDB();
    const user = await User.findById(id).select("name email");
    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({ user: { id: user._id.toString(), name: user.name, email: user.email } });
  } catch {
    return NextResponse.json({ user: null });
  }
}