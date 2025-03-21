// TaskTable.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TaskTableComponent from "./TaskTableComponent";
import PaginationController from "./PaginationController";
import useTasks from "@/hooks/useTasks";
import { TaskSortField } from "@/types/task";
import { SuccessPageResponse } from "@/types/apiRespons";

export default function TaskTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<TaskSortField>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [meta, setMeta] = useState<SuccessPageResponse<any>["meta"]>({
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
  });

  const handleSort = (column: TaskSortField) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  return (
    <div>
      {/* Add new task button */}
      <div className="flex justify-end mb-4">
        <Link href="/tasks/new">
          <Button variant="default"> + Add New Task</Button>
        </Link>
      </div>

      {/* Table component */}
      <TaskTableComponent
        page={page}
        perPage={perPage}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        onSort={handleSort}
        setMeta={setMeta}
      />

      {/* To pre fetch the next page beforehand */}
      <div style={{ display: "none" }}>
        <TaskTableComponent
          page={page + 1}
          perPage={perPage}
          sortColumn={sortColumn}
          sortOrder={sortOrder}
          onSort={handleSort}
          setMeta={setMeta}
        />
      </div>

      {/* Pagination component */}
      <PaginationController
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        meta={meta}
      />
    </div>
  );
}
