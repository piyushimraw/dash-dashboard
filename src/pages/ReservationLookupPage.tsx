import { DataTable } from "@/components/ui/table";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useGetRentedVehicleList } from "@/features/rent-vehicle/query";
import FiltersComponent from "@/components/reservation-lookup-components/FiltersComponent";
import SearchComponent from "@/components/reservation-lookup-components/SearchComponent";
import HeaderComponent from "@/components/reservation-lookup-components/HeaderComponent";
import { useRentVehicleFilters } from "@/hooks/useRentVehicleFilters";
import type { TableType } from "@/types/rent-vehicles/type";

export default function ReservationLookupPage() {
  const { data, isLoading } = useGetRentedVehicleList();
  const {
    initialFilters,
    filters,
    setSearch,
    filteredData,
    hasActiveFilters,
    submitFilters,
    resetFilters,
  } = useRentVehicleFilters(data);

  // Define table columns based on the performance context
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

          const statusMap: Record<string, string> = {
            Confirmed: "bg-green-100 text-green-700",
            Completed: "bg-gray-100 text-gray-700",
            Cancelled: "bg-red-100 text-red-700",
          };

          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                statusMap[status] ?? "bg-muted text-muted-foreground"
              }`}
            >
              {status}
            </span>
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
    <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6 px-4 py-6">
      {/* Header / Action bar */}
      <HeaderComponent />
      <div className=" flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <SearchComponent setSearch={setSearch} />
        {/* other filters */}
        <FiltersComponent
          initialFilters={initialFilters}
          filters={filters}
          resetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
          submitFilters={submitFilters}
        />
      </div>
      {/* Table container */}
      <DataTable
        columns={tableColumn as ColumnDef<unknown, unknown>[]}
        data={filteredData as TableType[]}
        isLoading={isLoading}
      />
    </div>
  );
}
