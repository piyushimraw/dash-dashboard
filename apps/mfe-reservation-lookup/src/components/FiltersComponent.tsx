import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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

const STATUS_OPTIONS = ["Confirmed", "Completed", "Cancelled"] as const;

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
                : "border-lavender hover:bg-lavender"
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
            Refine your reservation search. Click apply when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4">
          <div className="space-y-6">
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
              <Label htmlFor="status">Status</Label>
              <Select
                value={tempFilters.status || "all"}
                onValueChange={(value) => handleFilterChange("status", value === "all" ? "" : value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          <SheetFooter>
            <div className="flex gap-3 w-full">
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
