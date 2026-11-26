import { NextResponse } from "next/server";
import { InputSchema } from "@/lib/ai/schema";
import { generateContent } from "@/lib/ai/generate";

export const maxDuration = 60; // allow up to 60s on Vercel

export async function POST(request) {
  try {
    const body = await request.json();

    const parsed = InputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please fill in all fields correctly." },
        { status: 400 }
      );
    }

    const content = await generateContent(parsed.data);
    return NextResponse.json({ content });
  } catch (err) {
    console.error("generate error:", err);
    return NextResponse.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    );
  }
}