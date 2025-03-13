export type Task = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  due_date?: Date;
  priority?: "low" | "medium" | "high";
  status?: "todo" | "in-progress" | "done";
  created_at: Date;
  updated_at: Date;
};
