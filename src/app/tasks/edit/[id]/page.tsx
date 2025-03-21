"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSWRConfig } from "swr";
import { CalendarIcon, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import BackButton from "@/components/BackButton";

import { cn } from "@/lib/utils";
import { Priority, Status, TaskData } from "@/types/task";
import taskSchema from "@/app/api/tasks/schema";
import useTask from "@/hooks/useTask";
import { deleteTask, updateTask } from "@/utils/taskMutateFunctions";
import { DeleteTaskDialog } from "@/components/DeleteTaskDialog";

const formSchema = taskSchema;

export default function EditTask() {
  const { mutate, cache } = useSWRConfig();
  const router = useRouter();
  const { id } = useParams();
  const { task, isLoading } = useTask({ taskId: id as string });
  const [formInitialized, setFormInitialized] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      due_date: new Date(),
      priority: undefined,
      status: undefined,
    },
  });

  // Prefill the form when task data is available
  useEffect(() => {
    if (task && !formInitialized) {
      form.reset({
        title: task.title || "",
        description: task.description || "",
        category: task.category || "",
        due_date: task.due_date ? new Date(task.due_date) : new Date(),
        priority: (task.priority as Priority) || undefined,
        status: (task.status as Status) || undefined,
      });
      setFormInitialized(true);
    }
  }, [task, form, formInitialized]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!id) return;

    const taskData: TaskData = {
      title: values.title,
      description: values.description,
      category: values.category,
      due_date: values.due_date.toISOString(),
      priority: values.priority,
      status: values.status,
    };

    const updatedTask = await updateTask(id as string, taskData, mutate, cache);

    if (updatedTask) {
      router.push("/");
    }
  }

  function resetForm() {
    if (task) {
      form.reset({
        title: task.title || "",
        description: task.description || "",
        category: task.category || "",
        due_date: task.due_date ? new Date(task.due_date) : new Date(),
        priority: (task.priority as Priority) || undefined,
        status: (task.status as Status) || undefined,
      });
    }
  }

  async function handleDelete() {
    const taskDeleted = await deleteTask(id as string, mutate, cache);

    if (taskDeleted) {
      router.push("/");
    }
  }

  if (isLoading) {
    return <div className="py-2 px-6 lg:px-24 xl:px-48">Loading...</div>;
  }

  return (
    <div className="py-10 px-6 lg:px-24 xl:px-48">
      <div className="flex items-center mb-6">
        <BackButton />
        <h1 className="text-2xl font-bold ml-4">Edit Task</h1>
      </div>
      <div className="py-2 px-12 lg:px-24 xl:px-48">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Task description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={task?.priority}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Priority).map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={task?.status}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Status).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button type="submit">Update Task</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              </div>
              <DeleteTaskDialog id={id.toString()} onDelete={handleDelete} />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
