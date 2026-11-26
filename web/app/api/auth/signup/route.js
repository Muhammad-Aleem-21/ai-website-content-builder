import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { createSession } from "@/lib/auth";

const Body = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(120),
  password: z.string().min(8).max(100),
});

export async function POST(request) {
  try {
    const parsed = Body.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter a name, a valid email and a password of at least 8 characters." },
        { status: 400 }
      );
    }
    const { name, email, password } = parsed.data;

    await connectDB();
    if (await User.findOne({ email: email.toLowerCase() })) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    await createSession(user._id.toString());

    return NextResponse.json({ user: { id: user._id.toString(), name: user.name, email: user.email } });
  } catch (err) {
    console.error("signup error:", err);
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }
}