import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  const tasks = await prisma.task.findMany();
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  // Get the authenticated user's ID
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const validation = schema.safeParse(body);

  if (!validation.success) {
    console.log(body);
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const newTask = await prisma.task.create({
    data: {
      user_id: userId, // Use the Clerk authenticated user ID
      title: body.title,
      description: body.description || null,
      due_date: body.due_date ? new Date(body.due_date) : null,
      priority: body.priority || null,
      status: body.status || null,
    },
  });

  return NextResponse.json(newTask, { status: 201 });
}
