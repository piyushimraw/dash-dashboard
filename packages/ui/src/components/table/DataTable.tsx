import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./table";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";
import { type Row } from "@tanstack/react-table";
import { useIsDesktop } from "../../hooks/useIsDesktop";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultSort?: SortingState;
  isLoading?: boolean;
  globalSearch?: string;
}

export function customSortDataTable<TData>(field: keyof TData) {
  return (rowA: Row<TData>, rowB: Row<TData>) => {
    const a = rowA.original[field] as number | undefined;
    const b = rowB.original[field] as number | undefined;

    return (a ?? 0) - (b ?? 0);
  };
}

export function DataTable<TData, TValue>({
  columns,
  data = [],
  defaultSort,
  isLoading,
  globalSearch,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSort ?? []);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const isDesktop = useIsDesktop();

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter: globalSearch,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="relative">
      {/* Desktop Table View */}
      {isDesktop && (
      <div className="bg-white shadow-sm rounded-lg border border-lavender overflow-hidden">
        <Table className="w-full table-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-brand-yellow-light/50 border-b border-lavender"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      onClick={() => {
                        if (data?.length === 0 || !header.column.getCanSort())
                          return;
                        header.column.columnDef.meta?.onClick?.();
                        header.column.toggleSorting();
                      }}
                      className={clsx(
                        "h-[44px] py-3 px-4 select-none",
                        header.column.columnDef.meta?.className,
                        header.column.getCanSort() && "cursor-pointer",
                        !header.column.columnDef.meta?.disableHighlight &&
                          header.column.getCanSort() &&
                          header.column.id === hoveredColumn &&
                          "bg-brand-yellow-light",
                        !header.column.columnDef.meta?.disableHighlight &&
                          "border-b-2 border-b-lavender-deep bg-white",
                      )}
                      onMouseEnter={() => setHoveredColumn(header.column.id)}
                      onMouseLeave={() => setHoveredColumn(null)}
                    >
                      <div className="flex gap-2 self-stretch">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() ? (
                          header.column.getIsSorted() === "asc" ? (
                            <ChevronDown size={20} />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ChevronUp size={20} />
                          ) : null
                        ) : header.column.columnDef.meta?.forceArrow &&
                          sorting.length === 0 ? (
                          <ChevronUp size={20} />
                        ) : null}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center p-4">
                  No Data Found
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-b border-gray-100">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() => {
                        if (cell.column.columnDef.meta?.disableHighlight)
                          return;
                        cell.column.columnDef.meta?.onClick?.();
                      }}
                      onMouseEnter={() => setHoveredColumn(cell.column.id)}
                      onMouseLeave={() => setHoveredColumn(null)}
                      className={clsx(
                        "h-[55px] relative group p-4",
                        !cell.column.columnDef.meta?.disableHighlight &&
                          cell.column.getCanSort() &&
                          cell.column.id === hoveredColumn &&
                          "bg-brand-yellow-light/30",
                        cell.column.columnDef.meta?.hasLink &&
                          "cursor-pointer p-0 hover:border-b-2 hover:border-b-lavender-deep hover:bg-brand-yellow-light/30",
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      )}

      {/* Mobile Card View */}
      {!isDesktop && (
      <div className="space-y-4">
        {table.getRowModel().rows.length === 0 ? (
          <div className="text-center p-8 border border-lavender rounded-lg bg-white">
            No Data Found
          </div>
        ) : (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="border border-lavender rounded-lg p-4 bg-white shadow-sm space-y-3"
            >
              {row.getVisibleCells().map((cell) => {
                const header = cell.column.columnDef.header;
                const headerText =
                  typeof header === "string"
                    ? header
                    : typeof header === "function"
                      ? ""
                      : "";

                return (
                  <div
                    key={cell.id}
                    onClick={() => {
                      if (cell.column.columnDef.meta?.disableHighlight) return;
                      cell.column.columnDef.meta?.onClick?.();
                    }}
                    className={clsx(
                      "flex justify-between items-start gap-4",
                      cell.column.columnDef.meta?.hasLink && "cursor-pointer",
                    )}
                  >
                    <div className="font-medium text-sm text-gray-600 min-w-[100px]">
                      {headerText}
                    </div>
                    <div className="flex-1 text-right text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
      )}
    </div>
  );
}

const Loader = () => {
  return (
    <>
      {/* Desktop skeleton */}
      <div className="hidden lg:block overflow-hidden border border-gray-200 rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {[...Array(6)].map((_, idx) => (
                <th key={idx} className="px-4 py-3">
                  <div className="h-4 w-24 rounded skeleton-shimmer" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, rowIdx) => (
              <tr key={rowIdx} className="border-t border-gray-200">
                {[...Array(6)].map((_, colIdx) => (
                  <td key={colIdx} className="px-4 py-3">
                    <div className="h-4 w-full rounded skeleton-shimmer" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile skeleton */}
      <div className="lg:hidden space-y-4">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-lg p-4 space-y-3"
          >
            {[...Array(5)].map((_, rowIdx) => (
              <div className="flex justify-between" key={rowIdx}>
                <div className="h-4 w-1/3 rounded skeleton-shimmer" />
                <div className="h-4 w-1/3 rounded skeleton-shimmer" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};
