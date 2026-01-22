import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Filter, RotateCcw } from "lucide-react";
import clsx from "clsx";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import type { FilterState } from "@/types/rent-vehicles/type";
import { SelectBox } from "../ui/selectbox";

interface Props {
  initialFilters: FilterState;
  filters: FilterState;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  submitFilters: (v: FilterState) => void;
}
// const arrivalLocations = [
//   "BLRAIR", // Bengaluru Airport
//   "DELCTR", // Delhi City Center
//   "MUMT1", // Mumbai Terminal 1
//   "MUMT2", // Mumbai Terminal 2
//   "HYDAIR", // Hyderabad Airport
//   "CHNAIR", // Chennai Airport
//   "PNQAIR", // Pune Airport
//   "CCUAIR", // Kolkata Airport
//   "AMDAIR", // Ahmedabad Airport
//   "GOIAPD", // Goa Airport
// ];
const statusValues = [
  { label: "All", value: "All" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

export default function FiltersComponent({
  initialFilters,
  filters,
  resetFilters,
  hasActiveFilters,
  submitFilters,
}: Props) {
  const [open, setOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(initialFilters);
  //update global filters from temporary filters
  const handleApplyFilters = () => {
    submitFilters(tempFilters);
    setOpen(false);
  };
  //clear temp state of filters
  const resetTempFilters = () => setTempFilters(initialFilters);
  //clear temp and global state of filters
  const handleResetGlobalFilters = () => {
    resetFilters();
    resetTempFilters();
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };
  //set filters to initial state or initialize with existing global filters
  useEffect(() => {
    if (!open) {
      resetTempFilters();
    } else {
      setTempFilters(filters);
    }
  }, [open]);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Filter and Reset Buttons */}
      <div className="flex gap-2">
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className={clsx(
              "px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors",
              hasActiveFilters
                ? "bg-blue-50 border-blue-500 text-blue-700"
                : "border-gray-300 hover:bg-gray-50",
            )}
          >
            <Filter size={20} />
            <span className="hidden sm:inline">Filter</span>
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                !
              </span>
            )}
          </Button>
        </SheetTrigger>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={20} />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        )}
      </div>

      {/* Filter Sidebar */}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Make changes to your listing here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        {/* Sidebar */}
        <div className="px-4">
          {/* Filter Fields */}
          <div className="space-y-6">
            {/* ----- Filter rentals whose rent date falls within the selected start and end dates ---- */}
            {/* Start Date */}
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={tempFilters.startDate}
                onChange={(e) => {
                  handleFilterChange("startDate", e.target.value);
                }}
              />
            </div>

            {/* End Date */}
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={tempFilters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>

            {/* Status Dropdown */}
            <div>
              <SelectBox
                label="Status"
                placeholder="Select status"
                options={statusValues}
                value={tempFilters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              />
            </div>
            {/* Location Dropdown */}
            <div>
              <Label htmlFor="arrivalLocation">Arrival Location</Label>
              <Input
                id="arrivalLocation"
                type="text"
                value={tempFilters.arrivalLocation}
                onChange={(e) =>
                  handleFilterChange("arrivalLocation", e.target.value)
                }
                placeholder="Ex: CCUAIR"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <SheetFooter>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="border flex-1"
                onClick={handleResetGlobalFilters}
              >
                Reset All
              </Button>
              <Button className="flex-1" onClick={handleApplyFilters}>
                Apply Filters
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
