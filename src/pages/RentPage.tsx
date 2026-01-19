import { DataTable } from "@/components/ui/table";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useGetRentedVehicleList } from "@/features/rent-vehicle/query";
import FiltersComponent from "@/components/rent-vehicle-components/FiltersComponent";
import SearchComponent from "@/components/rent-vehicle-components/SearchComponent";
import HeaderComponent from "@/components/rent-vehicle-components/HeaderComponent";
import { useRentVehicleFilters } from "@/hooks/useRentVehicleFilters";
import type { TableType } from "@/types/rent-vehicles/type";

export default function RentPage() {
  const { data, isLoading } = useGetRentedVehicleList();
  const {
    filters,
    search,
    setSearch,
    filteredData,
    hasActiveFilters,
    submitFilters,
    handleResetFilters,
    handleFilterChange,
  } = useRentVehicleFilters(data);

  // Define table columns based on the performance context
  const tableColumn: ColumnDef<TableType>[] = useMemo(() => {
    return [
      {
        accessorKey: "vehicleId",
        header: "Vehicle ID",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.vehicleId}</span>
        ),
      },
      {
        accessorKey: "customerId",
        header: "Customer ID",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.customerId}
          </span>
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
        accessorKey: "expectedReturnDate",
        header: "Expected Return Date",
        cell: ({ row }) => (
          <span>
            {new Date(row.original.expectedReturnDate).toLocaleDateString()}
          </span>
        ),
      },
      {
        accessorKey: "pickupLocation",
        header: "Pickup Location",
        cell: ({ row }) => <span>{row.original.pickupLocation}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: false,
        cell: ({ row }) => {
          const status = row.original.status;

          const statusMap = {
            Pending: "bg-blue-100 text-blue-700",
            Approved: "bg-green-100 text-green-700",
            Rejected: "bg-red-100 text-red-700",
          };

          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusMap[status]}`}
            >
              {status}
            </span>
          );
        },
      },
    ];
  }, []);

  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6 px-4 py-6">
      {/* Header / Action bar */}
      <HeaderComponent />
      <div className=" flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <SearchComponent search={search} setSearch={setSearch} />
        {/* other filters */}
        <FiltersComponent
          filters={filters}
          handleFilterChange={handleFilterChange}
          handleResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          submitFilters={submitFilters}
        />
      </div>
      {/* Table container */}
      <DataTable
        columns={tableColumn as ColumnDef<unknown, unknown>[]}
        data={filteredData as TableType[]}
        isLoading={isLoading}
        globalSearch={search}
      />
    </div>
  );
}
