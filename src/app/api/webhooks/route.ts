import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data;
  const eventType = evt.type;
  //   Handle each event type
  if (evt.type === "user.created") {
    // If the event type is user.created then create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        id: evt.data.id,
        first_name: evt.data.first_name,
        last_name: evt.data.last_name,
        email: evt.data.email_addresses[0].email_address,
        username: evt.data.username,
      },
    });
    console.log("NewUser Added to DB:", newUser);
  } else if (evt.type === "user.updated") {
    // if the event type is user.updated then update the user in the database if that user exists
    const user = await prisma.user.findUnique({
      where: {
        id: evt.data.id,
      },
    });

    if (!user) {
      console.log("User not found in DB");
      return new Response("Webhook received", { status: 200 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: evt.data.id,
      },
      data: {
        first_name: evt.data.first_name,
        last_name: evt.data.last_name,
        email: evt.data.email_addresses[0].email_address,
        username: evt.data.username,
      },
    });
    console.log("User Updated in DB:", updatedUser);
  } else if (evt.type === "user.deleted") {
    // if the event type is user.deleted then delete the user from the database if that user exists
    const user = await prisma.user.findUnique({
      where: {
        id: evt.data.id,
      },
    });

    if (!user) {
      console.log("User not found in DB");
      return new Response("Webhook received", { status: 200 });
    }
    const deletedUser = await prisma.user.delete({
      where: {
        id: evt.data.id,
      },
    });
    console.log("User Deleted from DB:", deletedUser);
  }

  return new Response("Webhook received", { status: 200 });
}
