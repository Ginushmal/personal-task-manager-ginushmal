import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  successResponse,
  errorResponse,
  successPageResponse,
} from "@/utils/apiResponse";
import { getMongoUserId } from "@/actions/userID";

// export async function GET(request: NextRequest) {
//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       return NextResponse.json(
//         errorResponse({
//           status: 401,
//           error: "Unauthorized",
//           message: "You must be logged in to create a task",
//           code: "UNAUTHORIZED",
//         }),
//         { status: 401 }
//       );
//     }

//     const mdb_user_id = await prisma.user.findUnique({
//       where: { external_user_id: userId },
//       select: { id: true },
//     });

//     if (!mdb_user_id) {
//       return NextResponse.json(
//         errorResponse({
//           status: 404,
//           error: "Not Found",
//           message: "User not found",
//           code: "USER_NOT_FOUND",
//         }),
//         { status: 404 }
//       );
//     }

//     const tasks = await prisma.task.findMany({
//       where: { user_id: mdb_user_id.id },
//     });
//     return NextResponse.json(
//       successResponse({ data: tasks, message: "Tasks retrieved successfully" }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     return NextResponse.json(
//       errorResponse({
//         status: 500,
//         error: "Internal Server Error",
//         message: "Error fetching tasks",
//         code: "SERVER_ERROR",
//       }),
//       { status: 500 }
//     );
//   }
// }
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        errorResponse({
          status: 401,
          error: "Unauthorized",
          message: "You must be logged in to fetch tasks",
          code: "UNAUTHORIZED",
        }),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("perPage") || "10", 10);
    const sortBy = searchParams.get("sortBy") || "created_at"; // Default: createdAt
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc"; // Default: desc

    if (page < 1 || perPage < 1) {
      return NextResponse.json(
        errorResponse({
          status: 400,
          error: "Bad Request",
          message: "Invalid pagination parameters",
          code: "INVALID_PAGINATION",
        }),
        { status: 400 }
      );
    }

    // Validate sortBy field to prevent SQL injection
    const allowedSortFields = ["created_at", "title", "priority?"];
    if (!allowedSortFields.includes(sortBy)) {
      return NextResponse.json(
        errorResponse({
          status: 400,
          error: "Bad Request",
          message: `Invalid sortBy value. Allowed values: ${allowedSortFields.join(
            ", "
          )}`,
          code: "INVALID_SORT_BY",
        }),
        { status: 400 }
      );
    }

    const mdb_id = await getMongoUserId();

    if (!mdb_id) {
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

    // Fetch total count
    const total = await prisma.task.count({ where: { user_id: mdb_id } });
    const totalPages = Math.ceil(total / perPage);
    const skip = (page - 1) * perPage;

    // Fetch sorted & paginated tasks
    const tasks = await prisma.task.findMany({
      where: { user_id: mdb_id },
      skip,
      take: perPage,
      orderBy: { [sortBy]: sortOrder },
    });

    return NextResponse.json(
      successPageResponse({
        data: tasks,
        message: "Tasks retrieved successfully",
        total,
        page,
        perPage,
        totalPages,
      }),
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

    const mdb_id = await getMongoUserId();

    if (!mdb_id) {
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
        user_id: mdb_id,
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
