import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type Row,
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultSort?: SortingState;
  isLoading?: boolean;
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
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSort ?? []);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="overflow-hidden border border-neutrals-10">
        <table className="w-full border-collapse">
          <thead className="bg-neutrals-5">
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
              <tr key={rowIdx} className="border-t border-neutrals-10">
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
    );
  }

  return (
    <Table className="w-full table-auto">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="bg-neutrals-5 border-b-neutrals-10"
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
                      "bg-neutrals-10",
                    !header.column.columnDef.meta?.disableHighlight &&
                      "border-b-2 border-b-secondary-black shadow-shallow z-10 bg-white"
                  )}
                  onMouseEnter={() => setHoveredColumn(header.column.id)}
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  <div className="flex gap-2 self-stretch">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
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
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center p-4">
              No Data Found
            </TableCell>
          </TableRow>
        ) : (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="border-b-neutrals-10">
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  onClick={() => {
                    if (cell.column.columnDef.meta?.disableHighlight) return;
                    cell.column.columnDef.meta?.onClick?.();
                  }}
                  onMouseEnter={() => setHoveredColumn(cell.column.id)}
                  onMouseLeave={() => setHoveredColumn(null)}
                  className={clsx(
                    "h-[55px] relative group p-4",
                    !cell.column.columnDef.meta?.disableHighlight &&
                      cell.column.getCanSort() &&
                      cell.column.id === hoveredColumn &&
                      "bg-neutrals-5 cursor-pointer",
                    cell.column.columnDef.meta?.hasLink &&
                      "cursor-pointer p-0 hover:border-b-2 hover:border-b-secondary-black hover:bg-neutrals-5"
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableFooter,
} from "./table";
