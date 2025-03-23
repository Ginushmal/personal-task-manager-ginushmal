import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useTasks from "@/hooks/useTasks";
import { SuccessPageResponse } from "@/types/apiRespons";
import { Status, Task, TaskData, TaskSortField } from "@/types/task";
import {
  ChevronRight,
  CircleCheck,
  CircleDashed,
  CircleDotDashed,
  Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updateTask } from "@/utils/taskMutateFunctions";
import { useSWRConfig } from "swr";

export default function TaskTableComponent({
  page,
  perPage,
  sortColumn,
  sortOrder,
  search,
  onSort,
  setMeta,
}: {
  page: number;
  perPage: number;
  sortColumn: TaskSortField;
  sortOrder: "asc" | "desc";
  search: string;
  onSort: (column: TaskSortField) => void;
  setMeta: (meta: SuccessPageResponse<any>["meta"]) => void;
}) {
  const router = useRouter();
  const { tasks, meta } = useTasks({
    page: page,
    perPage: perPage,
    sortBy: sortColumn,
    sortOrder: sortOrder,
    search: search,
  });

  const [isMobile, setIsMobile] = useState(false);
  const [status, setStatus] = useState<{ [id: string]: Status }>({});
  const { mutate, cache } = useSWRConfig();

  // console.log("Search in table component", search);

  const onStatusButtonClick = async (id: string) => {
    setStatus((prev) => ({
      ...prev,
      [id]:
        prev[id] === Status.TODO
          ? Status.IN_PROGRESS
          : prev[id] === Status.IN_PROGRESS
          ? Status.DONE
          : Status.TODO,
    }));

    // Optimistically update the status
    // This will be reverted if the API call fails
    const task = tasks?.find((task) => task.id === id);
    if (task) {
      task.status =
        status[id] === Status.TODO
          ? Status.IN_PROGRESS
          : status[id] === Status.IN_PROGRESS
          ? Status.DONE
          : Status.TODO;
    }

    if (task) {
      const taskData: TaskData = {
        status: task.status,
        title: task.title,
      };

      // console.log("Cache keys ", cache.keys());

      // Update the task status in the API
      const updatedTask = await updateTask(
        id as string,
        taskData,
        mutate,
        cache
      );
    }
  };

  useEffect(() => {
    if (!tasks) return;

    const newStatus: { [id: string]: Status } = {};
    tasks.forEach((task) => {
      newStatus[task.id] = task.status ?? Status.TODO;
    });

    setStatus(newStatus); // Update state in one batch
  }, [tasks]);

  // Check viewport width on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is a common breakpoint for mobile
    };

    // Initial check
    checkIfMobile();

    // Add event listener for resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    if (meta) setMeta(meta);
  }, [meta]);

  const renderSortIndicator = (column: TaskSortField) => {
    if (sortColumn !== column) return null;
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  const columnOptions: { value: TaskSortField; label: string }[] = [
    { value: "title", label: "Title" },
    { value: "priority", label: "Priority" },
    { value: "status", label: "Status" },
    { value: "category", label: "Category" },
    { value: "due_date", label: "Due Date" },
  ];

  // Handle sort order toggle
  const handleSortOrderToggle = () => {
    onSort(sortColumn);
  };

  // Handle column selection change in mobile view
  const handleColumnChange = (value: TaskSortField) => {
    onSort(value);
  };

  return (
    <>
      {/* Mobile Sort Controls */}
      {isMobile && (
        <div className="flex items-center gap-2 mb-2">
          <Select
            value={sortColumn}
            onValueChange={(value) =>
              handleColumnChange(value as TaskSortField)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {columnOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleSortOrderToggle}>
            {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
          </Button>
        </div>
      )}

      <Table>
        {/* Desktop Header - Hidden on Mobile */}
        {!isMobile && (
          <TableHeader>
            <TableRow>
              {(
                [
                  "title",
                  "priority",
                  "status",
                  "category",
                  "due_date",
                ] as TaskSortField[]
              ).map((col) => (
                <TableHead
                  key={col}
                  onClick={() => onSort(col)}
                  className="cursor-pointer select-none"
                >
                  <div className="flex items-center">
                    {col.charAt(0).toUpperCase() + col.slice(1)}{" "}
                    {renderSortIndicator(col)}
                  </div>
                </TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
        )}

        <TableBody>
          {!tasks || tasks.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={isMobile ? 2 : 6}
                className="text-center text-gray-500"
              >
                No tasks found.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow
                key={task.id}
                className={status[task.id] === Status.DONE ? "opacity-50" : ""}
              >
                <TableCell>
                  <div>
                    <div
                      className={`font-medium ${
                        status[task.id] === Status.DONE ? "line-through" : ""
                      }`}
                    >
                      {task.title}
                    </div>
                    {isMobile && sortColumn !== "title" && (
                      <div
                        className={`text-sm text-gray-500 ${
                          status[task.id] === Status.DONE ? "line-through" : ""
                        }`}
                      >
                        {sortColumn === "due_date"
                          ? task.due_date
                            ? new Date(task.due_date).toLocaleString()
                            : "N/A"
                          : task[sortColumn] instanceof Date
                          ? task[sortColumn].toLocaleString()
                          : String(task[sortColumn])}
                      </div>
                    )}
                  </div>
                </TableCell>

                {!isMobile && (
                  <>
                    <TableCell
                      className={
                        status[task.id] === Status.DONE ? "line-through" : ""
                      }
                    >
                      {task.priority}
                    </TableCell>
                    <TableCell
                      className={
                        status[task.id] === Status.DONE ? "line-through" : ""
                      }
                    >
                      {task.status}
                    </TableCell>
                    <TableCell
                      className={
                        status[task.id] === Status.DONE ? "line-through" : ""
                      }
                    >
                      {task.category}
                    </TableCell>
                    <TableCell
                      className={
                        status[task.id] === Status.DONE ? "line-through" : ""
                      }
                    >
                      {task.due_date
                        ? new Date(task.due_date).toLocaleString()
                        : "N/A"}
                    </TableCell>
                  </>
                )}

                <TableCell>
                  <div className="flex gap-2 lg:justify-start justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onStatusButtonClick(task.id)}
                    >
                      {status[task.id] === Status.TODO && <CircleDashed />}
                      {status[task.id] === Status.IN_PROGRESS && (
                        <CircleDotDashed />
                      )}
                      {status[task.id] === Status.DONE && <CircleCheck />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/tasks/edit/${task.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}
