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
    <div className="relative w-full">
      {/* Table View */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <Table className="w-full table-auto min-w-[600px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-50 border-b border-gray-200"
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
                        "h-[44px] py-3 px-4 select-none bg-gray-50",
                        header.column.columnDef.meta?.className,
                        header.column.getCanSort() && "cursor-pointer hover:bg-gray-100",
                      )}
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
                <TableRow key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() => {
                        cell.column.columnDef.meta?.onClick?.();
                      }}
                      className={clsx(
                        "h-[55px] relative group p-4",
                        cell.column.columnDef.meta?.hasLink && "cursor-pointer",
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

    </div>
  );
}

const Loader = () => {
  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
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
  );
};
