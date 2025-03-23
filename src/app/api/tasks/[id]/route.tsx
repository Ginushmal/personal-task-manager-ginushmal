import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import schema from "../schema"; // Import task validation schema
import { ObjectId } from "mongodb";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import { Task } from "@/types/task";
import { getMongoUserId } from "@/actions/userID";

// Function to check if ID is a valid MongoDB ObjectId
const isValidObjectId = (id: string) => ObjectId.isValid(id);

// GET single task by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        errorResponse({
          status: 400,
          error: "Bad Request",
          message: "Invalid task ID",
          code: "INVALID_ID",
        }),
        { status: 400 }
      );
    }

    const task = await prisma.task.findUnique({ where: { id: params.id } });

    if (!task) {
      return NextResponse.json(
        errorResponse({
          status: 404,
          error: "Not Found",
          message: "Task not found",
          code: "NOT_FOUND",
        }),
        { status: 404 }
      );
    }

    const tasktyped = task as Task;

    return NextResponse.json(
      successResponse({
        data: tasktyped,
        message: "Task found",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      errorResponse({
        status: 500,
        error: "Internal Server Error",
        message: "Error fetching task",
        code: "SERVER_ERROR",
      }),
      { status: 500 }
    );
  }
}

// UPDATE task by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // console.log("PUT request body", request.body);
    // console.log("PUT request params", params);

    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        errorResponse({
          status: 400,
          error: "Bad Request",
          message: "Invalid task ID",
          code: "INVALID_ID",
        }),
        { status: 400 }
      );
    }

    const mdb_uid = await getMongoUserId();

    const body = await request.json();
    const validation = schema.partial().safeParse(body); // Allow partial updates

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

    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
    });

    // console.log("Existing task", existingTask);
    // console.log("User ID", mdb_uid);

    if (!existingTask || existingTask.user_id !== mdb_uid) {
      return NextResponse.json(
        errorResponse({
          status: 403,
          error: "Forbidden",
          message: "Task not found or you are not authorized to update it",
          code: "FORBIDDEN",
        }),
        { status: 403 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id: params.id },
      data: {
        title: body.title ?? existingTask.title,
        description: body.description ?? existingTask.description,
        due_date: body.due_date
          ? new Date(body.due_date)
          : existingTask.due_date,
        priority: body.priority ?? existingTask.priority,
        status: body.status ?? existingTask.status,
      },
    });

    const updatedTasktyped = updatedTask as Task;

    return NextResponse.json(
      successResponse({
        data: updatedTasktyped,
        message: "Task updated successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      errorResponse({
        status: 500,
        error: "Internal Server Error",
        message: "Error updating task",
        code: "SERVER_ERROR",
      }),
      { status: 500 }
    );
  }
}

// DELETE task by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        errorResponse({
          status: 400,
          error: "Bad Request",
          message: "Invalid task ID",
          code: "INVALID_ID",
        }),
        { status: 400 }
      );
    }

    const mdb_uid = await getMongoUserId();
    if (!mdb_uid) {
      return NextResponse.json(
        errorResponse({
          status: 401,
          error: "Unauthorized",
          message: "You must be logged in to delete a task",
          code: "UNAUTHORIZED",
        }),
        { status: 401 }
      );
    }

    const task = await prisma.task.findUnique({ where: { id: params.id } });

    if (!task || task.user_id !== mdb_uid) {
      return NextResponse.json(
        errorResponse({
          status: 403,
          error: "Forbidden",
          message: "Task not found or you are not authorized to delete it",
          code: "FORBIDDEN",
        }),
        { status: 403 }
      );
    }

    await prisma.task.delete({ where: { id: params.id } });

    const delTaskTyped = task as Task;

    return NextResponse.json(
      successResponse({
        data: delTaskTyped,
        message: "Task deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      errorResponse({
        status: 500,
        error: "Internal Server Error",
        message: "Error deleting task",
        code: "SERVER_ERROR",
      }),
      { status: 500 }
    );
  }
}
