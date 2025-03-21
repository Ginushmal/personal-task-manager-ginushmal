// TaskTableComponent.jsx
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import useTasks from "@/hooks/useTasks";
import { SuccessPageResponse } from "@/types/apiRespons";
import { Task, TaskSortField } from "@/types/task";
import { useEffect } from "react";

export default function TaskTableComponent({
  page,
  perPage,
  sortColumn,
  sortOrder,
  onSort,
  setMeta,
}: {
  page: number;
  perPage: number;
  sortColumn: TaskSortField;
  sortOrder: "asc" | "desc";
  onSort: (column: TaskSortField) => void;
  setMeta: (meta: SuccessPageResponse<any>["meta"]) => void;
}) {
  const { tasks, meta } = useTasks({
    page: page,
    perPage: perPage,
    sortBy: sortColumn,
    sortOrder: sortOrder,
  });

  useEffect(() => {
    if (meta) setMeta(meta);
  }, [meta]);

  const renderSortIndicator = (column: TaskSortField) => {
    if (sortColumn !== column) return null;
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  return (
    <Table>
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {!tasks || tasks.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-gray-500">
              No tasks found.
            </TableCell>
          </TableRow>
        ) : (
          tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.priority}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>{task.category}</TableCell>
              <TableCell>
                {task.due_date
                  ? new Date(task.due_date).toLocaleString()
                  : "N/A"}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
