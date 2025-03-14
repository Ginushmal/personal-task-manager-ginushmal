import { z } from "zod";
import { Priority, Status } from "@/types/task"; // Import the enums

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  due_date: z.string().datetime({ offset: true }).pipe(z.coerce.date()),
  priority: z.nativeEnum(Priority).optional(),
  status: z.nativeEnum(Status).optional(),
});

export default schema;
