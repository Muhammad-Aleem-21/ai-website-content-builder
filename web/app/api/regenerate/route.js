import { NextResponse } from "next/server";
import { z } from "zod";
import { InputSchema, SECTIONS } from "@/lib/ai/schema";
import { regenerateSection } from "@/lib/ai/generate";

export const maxDuration = 60;

const BodySchema = z.object({
  input: InputSchema,
  section: z.enum(SECTIONS),
  currentContent: z.record(z.string(), z.any()), // { [section]: current content }
  instruction: z.string().max(300).optional().default(""),
});

export async function POST(request) {
  try {
    const body = await request.json();

    const parsed = BodySchema.safeParse(body);
    if (!parsed.success || parsed.data.currentContent[parsed.data.section] === undefined) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const { input, section, currentContent, instruction } = parsed.data;
    const content = await regenerateSection(input, section, currentContent, instruction);
    return NextResponse.json({ content });
  } catch (err) {
    console.error("regenerate error:", err);
    return NextResponse.json(
      { error: "Failed to regenerate. Please try again." },
      { status: 500 }
    );
  }
}