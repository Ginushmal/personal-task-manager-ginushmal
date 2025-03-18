"use server";

import { prisma } from "@/app/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getMongoUserId() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized: You must be logged in.");
  }

  const mdbUser = await prisma.user.findUnique({
    where: { external_user_id: userId },
    select: { id: true },
  });

  if (!mdbUser) {
    throw new Error("User not found in the database.");
  }

  return mdbUser.id;
}
