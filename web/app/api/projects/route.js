import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { getUserId } from "@/lib/auth";
import { InputSchema, ContentSchema } from "@/lib/ai/schema";

const Body = z.object({
  name: z.string().trim().min(1).max(120),
  input: InputSchema,
  content: ContentSchema,
  selections: z.record(z.string(), z.number()).optional().default({}),
});

// List the current user's projects (newest first), without the heavy content.
export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  await connectDB();
  const projects = await Project.find({ userId: new mongoose.Types.ObjectId(userId) })
    .select("name input.websiteType input.tone input.industry updatedAt createdAt")
    .sort({ updatedAt: -1 })
    .lean();

  return NextResponse.json({
    projects: projects.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      websiteType: p.input?.websiteType,
      tone: p.input?.tone,
      industry: p.input?.industry,
      updatedAt: p.updatedAt,
      createdAt: p.createdAt,
    })),
  });
}

// Create a project.
export async function POST(request) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Please log in." }, { status: 401 });

    const parsed = Body.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid project data." }, { status: 400 });

    await connectDB();
    const project = await Project.create({ ...parsed.data, userId });
    return NextResponse.json({ id: project._id.toString() });
  } catch (err) {
    console.error("create project error:", err);
    return NextResponse.json({ error: "Could not save project." }, { status: 500 });
  }
}