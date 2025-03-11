import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import schema from "../schema"; // Import task validation schema
import { ObjectId } from "mongodb";

// Function to check if ID is a valid MongoDB ObjectId
const isValidObjectId = (id: string) => ObjectId.isValid(id);

// GET single task by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isValidObjectId(params.id)) {
    return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
  }
  const task = await prisma.task.findUnique({ where: { id: params.id } });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(task);
}

// UPDATE task by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isValidObjectId(params.id)) {
    return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
  }
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const validation = schema.partial().safeParse(body); // Allow partial updates

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const existingTask = await prisma.task.findUnique({
    where: { id: params.id },
  });
  if (!existingTask || existingTask.user_id !== userId) {
    return NextResponse.json(
      { error: "Task not found or unauthorized" },
      { status: 403 }
    );
  }

  const updatedTask = await prisma.task.update({
    where: { id: params.id },
    data: {
      title: body.title ?? existingTask.title,
      description: body.description ?? existingTask.description,
      due_date: body.due_date ? new Date(body.due_date) : existingTask.due_date,
      priority: body.priority ?? existingTask.priority,
      status: body.status ?? existingTask.status,
    },
  });

  return NextResponse.json(updatedTask);
}

// DELETE task by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isValidObjectId(params.id)) {
    return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
  }
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const task = await prisma.task.findUnique({ where: { id: params.id } });
  if (!task || task.user_id !== userId) {
    return NextResponse.json(
      { error: "Task not found or unauthorized" },
      { status: 403 }
    );
  }

  await prisma.task.delete({ where: { id: params.id } });

  return NextResponse.json(task);
}
