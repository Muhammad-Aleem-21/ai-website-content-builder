import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { createSession } from "@/lib/auth";

const Body = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export async function POST(request) {
  try {
    const parsed = Body.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
    }
    const { email, password } = parsed.data;

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    const ok = user && (await bcrypt.compare(password, user.passwordHash));

    // Same message for "no such user" and "wrong password" so attackers can't probe emails.
    if (!ok) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    await createSession(user._id.toString());
    return NextResponse.json({ user: { id: user._id.toString(), name: user.name, email: user.email } });
  } catch (err) {
    console.error("login error:", err);
    return NextResponse.json({ error: "Could not log in." }, { status: 500 });
  }
}