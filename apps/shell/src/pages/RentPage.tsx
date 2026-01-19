import { Button } from "@/components/ui/button";
import { useGlobalDialogStore } from "@/components/dialogs/useGlobalDialogStore";
import { DataTable } from "@/components/ui/table";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useGetRentedVehicleList } from "@/features/rent-vehicle/query";

export type TableType = {
  vehicleId: string;
  customerId: string;
  rentDate: string;
  expectedReturnDate: string;
  pickupLocation: string;
  status: "Approved" | "Pending" | "Rejected";
};

export default function RentPage() {
  const { openDialog } = useGlobalDialogStore();
  const { data, isLoading } = useGetRentedVehicleList();
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
        cell: ({ row }) => (
          <span className="truncate max-w-[180px] block">
            {row.original.pickupLocation}
          </span>
        ),
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
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">
            Rent Vehicles
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage and track all rented vehicles
          </p>
        </div>

        <Button
          onClick={() => openDialog("RENT_VEHICLE")}
          className="flex items-center gap-2"
        >
          + Add New Vehicle
        </Button>
      </div>

      {/* Table container */}
      <div className="bg-white shadow-sm">
        <DataTable
          columns={tableColumn as ColumnDef<unknown, unknown>[]}
          data={data as TableType[]}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
