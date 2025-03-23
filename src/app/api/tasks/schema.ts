import { z } from "zod";
import { Priority, Status } from "@/types/task"; // Import the enums

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  due_date: z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  ),
  priority: z.nativeEnum(Priority).optional(),
  status: z.nativeEnum(Status).optional(),
});

export default taskSchema;
