// PaginationController.jsx
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SuccessPageResponse } from "@/types/apiRespons";

export default function PaginationController({
  page,
  setPage,
  perPage,
  setPerPage,
  meta,
}: {
  page: number;
  setPage: (page: number) => void;
  perPage: number;
  setPerPage: (perPage: number) => void;
  meta: SuccessPageResponse<any>["meta"] | null;
}) {
  return (
    <div className="flex items-center justify-between px-2 pt-6 mb-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Showing {page} tasks out of {meta?.total ?? 0}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Tasks per page</p>
          <Select
            value={String(perPage)}
            onValueChange={(value) => {
              setPerPage(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={String(perPage)} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 50].map((num) => (
                <SelectItem key={num} value={String(num)}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {page} of {meta?.totalPages ?? 0}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            &laquo;
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1}
          >
            &lsaquo;
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() =>
              setPage(page < (meta?.totalPages ?? 0) ? page + 1 : page)
            }
            disabled={page >= (meta?.totalPages ?? 0)}
          >
            &rsaquo;
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPage(meta?.totalPages ?? 0)}
            disabled={page >= (meta?.totalPages ?? 0)}
          >
            &raquo;
          </Button>
        </div>
      </div>
    </div>
  );
}
