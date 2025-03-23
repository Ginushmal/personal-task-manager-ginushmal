"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import Input from shadcn/ui
import TaskTableComponent from "./TaskTableComponent";
import PaginationController from "./PaginationController";
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
  const [search, setSearch] = useState("");

  const handleSort = (column: TaskSortField) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };
  // console.log("search", search);
  return (
    <div>
      {/* Search Input Field */}
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 mb-4 w-full">
        <Input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64"
        />
        <Link href="/tasks/new" className="w-full md:w-auto">
          <Button variant="default" className="w-full md:w-auto">
            + Add New Task
          </Button>
        </Link>
      </div>

      {/* Table component */}
      <TaskTableComponent
        page={page}
        perPage={perPage}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        search={search}
        onSort={handleSort}
        setMeta={setMeta}
      />

      {/* Pre-fetch next page */}
      <div style={{ display: "none" }}>
        <TaskTableComponent
          page={page + 1}
          perPage={perPage}
          sortColumn={sortColumn}
          sortOrder={sortOrder}
          search={search}
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
