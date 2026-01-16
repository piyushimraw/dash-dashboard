import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
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
}
//function to sort data based on dynamic field
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
  defaultSort, //value should be passed like defaultSort={[{ id: "category", desc: false }]}
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
      <div className="rounded-sm border border-neutrals-10 p-4 space-y-2">
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="h-6 bg-neutrals-10 rounded" />
        ))}
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
                      //cursor for sortable column
                      header.column.getCanSort() && "cursor-pointer",
                      //column hover effect
                      !header.column.columnDef.meta?.disableHighlight &&
                        header.column.getCanSort() && //if enableSorting: false not passed in columns,
                        header.column.id === hoveredColumn &&
                        "bg-neutrals-10",
                      //selected effect
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
                        sorting.length === 0 ? ( //if other column not selected then show icon
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
                      // If a click operation is defined for the column header, the same operation is applied to cell clicks within this column.
                      cell.column.columnDef.meta?.onClick?.();
                    }}
                    onMouseEnter={() => setHoveredColumn(cell.column.id)}
                    onMouseLeave={() => setHoveredColumn(null)}
                    className={clsx(
                      "h-[55px] relative group p-4",
                      //column hover effect
                      !cell.column.columnDef.meta?.disableHighlight &&
                        cell.column.getCanSort() && //if enableSorting: false not passed in columns,
                        cell.column.id === hoveredColumn &&
                        "bg-neutrals-5 cursor-pointer",
                      //cell link hover effect
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
