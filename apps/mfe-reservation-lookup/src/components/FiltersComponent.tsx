import {
  Button,
  Input,
  Label,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@packages/ui";
import { Filter, RotateCcw } from "lucide-react";
import clsx from "clsx";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import type { FilterState } from "../types/type";

interface Props {
  initialFilters: FilterState;
  filters: FilterState;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  submitFilters: (v: FilterState) => void;
}

export function FiltersComponent({
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
                ? "bg-brand-yellow-light border-brand-yellow-dark text-lavender-deep"
                : "border-lavender hover:bg-lavender",
            )}
          >
            <Filter size={20} />
            <span className="hidden sm:inline">Filter</span>
            {hasActiveFilters && (
              <span className="bg-brand-yellow text-lavender-deep text-xs rounded-full w-5 h-5 flex items-center justify-center">
                !
              </span>
            )}
          </Button>
        </SheetTrigger>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="px-4 py-2 border border-lavender rounded-lg flex items-center gap-2 hover:bg-lavender transition-colors"
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
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  handleFilterChange("startDate", event.target.value);
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
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleFilterChange("endDate", event.target.value)
                }
              />
            </div>

            {/* Status Dropdown */}
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={tempFilters.status}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  handleFilterChange("status", event.target.value)
                }
                className="w-full px-3 py-2 border border-lavender rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent bg-white"
              >
                <option value="">All Statuses</option>
                {[
                  "Confirmed",
                  "Completed",
                  "Cancelled",
                ].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            {/* Location Dropdown */}
            <div>
              <Label htmlFor="arrivalLocation">Arrival Location</Label>
              <Input
                id="arrivalLocation"
                type="text"
                value={tempFilters.arrivalLocation}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleFilterChange("arrivalLocation", event.target.value)
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
