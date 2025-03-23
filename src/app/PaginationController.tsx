import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SuccessPageResponse } from "@/types/apiRespons";
import { useEffect, useState } from "react";

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
  const [isMobile, setIsMobile] = useState(false);

  // Check viewport width on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between px-2 pt-4 sm:pt-6 mb-4 gap-3 sm:gap-0`}
    >
      {/* Status text - simplified on mobile */}
      <div className="text-sm text-muted-foreground text-center sm:text-left">
        {isMobile
          ? `Page ${page}/${meta?.totalPages ?? 0}`
          : `Showing ${page} tasks out of ${meta?.total ?? 0}`}
      </div>

      {/* Mobile-optimized controls container */}
      <div
        className={`flex ${
          isMobile
            ? "flex-col items-center"
            : "items-center space-x-6 lg:space-x-8"
        } w-full sm:w-auto`}
      >
        {/* Per page selector - Stacked on mobile */}
        <div
          className={`flex items-center ${
            isMobile ? "w-full justify-between mb-3" : "space-x-2"
          }`}
        >
          <p className="text-sm font-medium">Tasks per page</p>
          <Select
            value={String(perPage)}
            onValueChange={(value) => {
              setPerPage(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className={`h-8 ${isMobile ? "w-20" : "w-[70px]"}`}>
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

        {/* Page counter - Hidden on mobile (already shown in the status text) */}
        {!isMobile && (
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {page} of {meta?.totalPages ?? 0}
          </div>
        )}

        {/* Navigation buttons - Full width on mobile */}
        <div
          className={`flex items-center ${
            isMobile ? "w-full justify-between" : "space-x-2"
          }`}
        >
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
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

          {/* Current page indicator - Mobile only */}
          {isMobile && <span className="text-sm font-medium">{page}</span>}

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
            className="h-8 w-8 p-0"
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
