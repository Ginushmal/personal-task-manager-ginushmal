import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  due_date: z.string().datetime({ offset: true }).pipe(z.coerce.date()),
  priority: z.string().optional(),
  status: z.string().optional(),
});

export default schema;
