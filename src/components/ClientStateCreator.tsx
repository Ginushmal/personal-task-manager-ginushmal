"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserStore } from "@/store/userStore";
import { getMongoUserId } from "@/actions/userID";

export default function ClientStateCreator() {
  const { user } = useUser();
  const setUser = useUserStore((state) => state.setUser);
  const [mdbId, setMdbId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserId() {
      try {
        const id = await getMongoUserId();
        setMdbId(id);
      } catch (error) {
        console.error("Error fetching MongoDB user ID:", error);
      }
    }

    if (user) {
      fetchUserId();
    }
  }, [user]);

  useEffect(() => {
    if (user && mdbId) {
      setUser({
        id: mdbId,
        external_user_id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        first_name: user.firstName || "",
        last_name: user.lastName || "",
        username: user.username || "",
        image_url: user.imageUrl || "",
      });
    }
  }, [user, mdbId, setUser]);

  return null;
}
