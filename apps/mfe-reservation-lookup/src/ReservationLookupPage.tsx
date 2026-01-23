import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  useIsDesktop,
} from "@packages/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useGetRentedVehicleList } from "./features/rent-vehicle/query";
import { FiltersComponent } from "./components/FiltersComponent";
import { FilterChips } from "./components/FilterChips";
import { SearchComponent } from "./components/SearchComponent";
import { useRentVehicleFilters } from "./hooks/useRentVehicleFilters";
import type { TableType } from "./types/type";

export function ReservationLookupPage() {
  const isDesktop = useIsDesktop();
  const { data, isLoading } = useGetRentedVehicleList();
  const {
    initialFilters,
    filters,
    search,
    setSearch,
    filteredData,
    hasActiveFilters,
    submitFilters,
    resetFilters,
    removeFilter,
  } = useRentVehicleFilters(data);

  const tableColumn: ColumnDef<TableType>[] = useMemo(() => {
    return [
      {
        accessorKey: "id",
        header: "#",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.id}</span>
        ),
      },
      {
        accessorKey: "customerName",
        header: "Customer Name",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.customerName}</span>
        ),
      },
      {
        accessorKey: "serviceLevel",
        header: "Svc Level",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.serviceLevel}
          </span>
        ),
      },
      {
        accessorKey: "cvi",
        header: "CVI",
        cell: ({ row }) => <span>{row.original.cvi}</span>,
      },
      {
        accessorKey: "estArrival",
        header: "Est Arrival",
        cell: ({ row }) => <span>{row.original.estArrival}</span>,
      },
      {
        accessorKey: "flightInfoStatus",
        header: "Flight Info Status",
        cell: ({ row }) => <span>{row.original.flightInfoStatus}</span>,
      },
      {
        accessorKey: "numberOfDays",
        header: "# of Days",
        cell: ({ row }) => <span>{row.original.numberOfDays}</span>,
      },
      {
        accessorKey: "resClass",
        header: "Res Class",
        cell: ({ row }) => <span>{row.original.resClass}</span>,
      },
      {
        accessorKey: "resStatus",
        header: "Res Status",
        cell: ({ row }) => {
          const status = row.original.resStatus;

          const statusVariantMap: Record<
            string,
            "success" | "muted" | "destructive"
          > = {
            Confirmed: "success",
            Completed: "muted",
            Cancelled: "destructive",
          };

          return (
            <Badge variant={statusVariantMap[status] ?? "muted"}>
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "dashStatus",
        header: "DASH Status",
        cell: ({ row }) => (
          <span className="text-xs font-medium">{row.original.dashStatus}</span>
        ),
      },
      {
        accessorKey: "rentDate",
        header: "Rent Date",
        cell: ({ row }) => (
          <span>{new Date(row.original.rentDate).toLocaleDateString()}</span>
        ),
      },
      {
        accessorKey: "returnDate",
        header: "Return Date",
        cell: ({ row }) => (
          <span>{new Date(row.original.returnDate).toLocaleDateString()}</span>
        ),
      },
      {
        accessorKey: "arrivalLocation",
        header: "Arrival Location",
        cell: ({ row }) => <span>{row.original.arrivalLocation}</span>,
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.email}</span>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => <span>{row.original.phone}</span>,
      },
    ];
  }, []);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Reservation Search Results</CardTitle>
              <CardDescription>Track all rented vehicles</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters Row - Sticky on mobile */}
          <div
            className={
              isDesktop
                ? "flex flex-col sm:flex-row gap-3"
                : "sticky top-0 z-10 -mx-4 px-4 py-3 bg-card border-b flex flex-col sm:flex-row gap-3"
            }
          >
            <SearchComponent search={search} setSearch={setSearch} />
            <FiltersComponent
              initialFilters={initialFilters}
              filters={filters}
              resetFilters={resetFilters}
              hasActiveFilters={hasActiveFilters}
              submitFilters={submitFilters}
            />
          </div>

          {/* Active Filter Chips */}
          <FilterChips filters={filters} onRemoveFilter={removeFilter} />

          {/* Table */}
          <DataTable
            columns={tableColumn as ColumnDef<unknown, unknown>[]}
            data={filteredData as TableType[]}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
