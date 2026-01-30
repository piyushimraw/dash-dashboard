import {
  Button,
  Input,
  Label,
  SelectBox
} from "@packages/ui";
import { Filter, RotateCcw } from "lucide-react";
import clsx from "clsx";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import type { FilterState } from "../types/type";
import { ResponsiveFilterPanel } from "./ResponsiveFilterPanel";

interface Props {
  initialFilters: FilterState;
  filters: FilterState;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  submitFilters: (v: FilterState) => void;
}

const statusValues = [
  { label: "All", value: "All" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

export function FiltersComponent({
  initialFilters,
  filters,
  resetFilters,
  hasActiveFilters,
  submitFilters,
}: Props) {
  const [open, setOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(initialFilters);

  const handleApplyFilters = () => {
    submitFilters(tempFilters);
    setOpen(false);
  };

  const resetTempFilters = () => setTempFilters(initialFilters);

  const handleResetGlobalFilters = () => {
    resetFilters();
    resetTempFilters();
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!open) {
      resetTempFilters();
    } else {
      setTempFilters(filters);
    }
  }, [open]);

  return (
    <>
      {/* Filter and Reset Buttons */}
      <div className="flex gap-2">
        <ResponsiveFilterPanel
          open={open}
          onOpenChange={setOpen}
          trigger={
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
          }
        >
          {/* Filter Form Content */}
          <div className="space-y-4 p-4">
            <div>
              <h3 className="text-lg font-semibold">Filters</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Refine your reservation search. Click apply when you&apos;re
                done.
              </p>
            </div>

            <div className="space-y-4">
              {/* Start Date */}
              <div className="space-y-2">
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
              <div className="space-y-2">
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

              {/* Status Select */}
              <div className="space-y-2">
                <SelectBox
                  label="Status"
                  placeholder="Select status"
                  options={statusValues}
                  value={tempFilters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                />
              </div>

              {/* Arrival Location */}
              <div className="space-y-2">
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
            <div className="flex gap-3 w-full pt-4">
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
          </div>
        </ResponsiveFilterPanel>

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
    </>
  );
}
