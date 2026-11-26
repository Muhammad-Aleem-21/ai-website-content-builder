import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { getUserId } from "@/lib/auth";
import { InputSchema, ContentSchema } from "@/lib/ai/schema";

const UpdateBody = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  input: InputSchema.optional(),
  content: ContentSchema.optional(),
  selections: z.record(z.string(), z.number()).optional(),
});

// Every query filters by BOTH id and userId, so users can only touch their own projects.
async function authorize(params) {
  const userId = await getUserId();
  if (!userId) return { error: NextResponse.json({ error: "Please log in." }, { status: 401 }) };

  const { id } = await params; // params is a Promise in Next.js 15+
  if (!mongoose.isValidObjectId(id)) {
    return { error: NextResponse.json({ error: "Project not found." }, { status: 404 }) };
  }
  await connectDB();
  return { id, userId };
}

export async function GET(_request, { params }) {
  const a = await authorize(params);
  if (a.error) return a.error;

  const p = await Project.findOne({ _id: a.id, userId: a.userId }).lean();
  if (!p) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  return NextResponse.json({
    project: {
      id: p._id.toString(),
      name: p.name,
      input: p.input,
      content: p.content,
      selections: p.selections,
      updatedAt: p.updatedAt,
    },
  });
}

export async function PUT(request, { params }) {
  const a = await authorize(params);
  if (a.error) return a.error;

  const parsed = UpdateBody.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid project data." }, { status: 400 });

  const p = await Project.findOneAndUpdate(
    { _id: a.id, userId: a.userId },
    { $set: parsed.data },
    { new: true }
  );
  if (!p) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request, { params }) {
  const a = await authorize(params);
  if (a.error) return a.error;

  const res = await Project.deleteOne({ _id: a.id, userId: a.userId });
  if (res.deletedCount === 0) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  return NextResponse.json({ ok: true });
}