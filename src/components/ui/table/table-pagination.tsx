import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Table } from "@tanstack/react-table";
import { AppPagination } from "../pagination";

export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  disabledPagination: boolean;
}

export function TablePagination<TData>({
  table,
  disabledPagination,
}: DataTablePaginationProps<TData>) {
  if (disabledPagination) return null;

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex flex-col gap-3 px-2 py-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Rows per page */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Rows per page
        </span>

        <Select
          value={String(pageSize)}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="h-8 w-[90px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Right: Pagination */}
      <div className="flex justify-end sm:justify-end">
        <AppPagination
          page={pageIndex + 1}
          pageSize={pageSize}
          totalItems={totalRows}
          onPageChange={(page) => table.setPageIndex(page - 1)}
        />
      </div>
    </div>
  );
}
