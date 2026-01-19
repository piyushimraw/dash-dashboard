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
import { useState } from "react";
import type { FilterState } from "@/types/rent-vehicles/type";

interface Props {
  filters: FilterState;
  handleFilterChange: (key: any, value: string) => void;
  handleResetFilters: () => void;
  hasActiveFilters: string;
  submitFilters: () => void;
}

export default function FiltersComponent({
  filters,
  handleFilterChange,
  handleResetFilters,
  hasActiveFilters,
  submitFilters,
}: Props) {
  const [open, setOpen] = useState(false);
  const handleApplyFilters = () => {
    submitFilters();
    setOpen(false);
  };

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
                : "border-gray-300 hover:bg-gray-50"
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
            onClick={handleResetFilters}
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
            {/* Start Date */}
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => {
                  console.log(e.target.value);
                  handleFilterChange("startDate", e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* End Date */}
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">All Statuses</option>
                {["Approved", "Pending", "Rejected"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <SheetFooter>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={handleResetFilters}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset All
              </Button>
              <Button
                onClick={handleApplyFilters}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
