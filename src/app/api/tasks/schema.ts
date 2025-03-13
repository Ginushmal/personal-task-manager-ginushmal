import { z } from "zod";

enum PriorityType {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

enum StatusType {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  due_date: z.string().datetime({ offset: true }).pipe(z.coerce.date()),
  priority: z.nativeEnum(PriorityType).optional(),
  status: z.nativeEnum(StatusType).optional(),
});

export { schema, PriorityType, StatusType };
export default schema;
