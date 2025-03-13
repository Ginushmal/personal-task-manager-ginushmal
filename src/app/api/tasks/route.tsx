import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { successResponse, errorResponse } from "@/utils/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        errorResponse({
          status: 401,
          error: "Unauthorized",
          message: "You must be logged in to create a task",
          code: "UNAUTHORIZED",
        }),
        { status: 401 }
      );
    }

    const mdb_user_id = await prisma.user.findUnique({
      where: { external_user_id: userId },
      select: { id: true },
    });

    if (!mdb_user_id) {
      return NextResponse.json(
        errorResponse({
          status: 404,
          error: "Not Found",
          message: "User not found",
          code: "USER_NOT_FOUND",
        }),
        { status: 404 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: { user_id: mdb_user_id.id },
    });
    return NextResponse.json(
      successResponse({ data: tasks, message: "Tasks retrieved successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      errorResponse({
        status: 500,
        error: "Internal Server Error",
        message: "Error fetching tasks",
        code: "SERVER_ERROR",
      }),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        errorResponse({
          status: 401,
          error: "Unauthorized",
          message: "You must be logged in to create a task",
          code: "UNAUTHORIZED",
        }),
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = schema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        errorResponse({
          status: 400,
          error: "Validation Error",
          message: "Invalid request body",
          details: validation.error.errors,
          code: "VALIDATION_ERROR",
        }),
        { status: 400 }
      );
    }

    const mdb_user_id = await prisma.user.findUnique({
      where: { external_user_id: userId },
      select: { id: true },
    });

    if (!mdb_user_id) {
      return NextResponse.json(
        errorResponse({
          status: 404,
          error: "Not Found",
          message: "User not found",
          code: "USER_NOT_FOUND",
        }),
        { status: 404 }
      );
    }

    const newTask = await prisma.task.create({
      data: {
        user_id: mdb_user_id.id,
        title: body.title,
        description: body.description || null,
        category: body.category || null,
        due_date: body.due_date ? new Date(body.due_date) : null,
        priority: body.priority || null,
        status: body.status || null,
      },
    });

    return NextResponse.json(
      successResponse({ data: newTask, message: "Task created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      errorResponse({
        status: 500,
        error: "Internal Server Error",
        message: "Error creating task",
        code: "SERVER_ERROR",
      }),
      { status: 500 }
    );
  }
}
