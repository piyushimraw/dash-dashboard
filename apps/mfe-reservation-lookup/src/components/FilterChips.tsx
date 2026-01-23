import { Button } from "@packages/ui";
import { X } from "lucide-react";
import type { FilterState } from "../types/type";

interface FilterChipsProps {
  filters: FilterState;
  onRemoveFilter: (key: keyof FilterState) => void;
}

/**
 * FilterChips
 *
 * Displays active filters as removable chips with yellow/gold theming.
 * Per CONTEXT.md: "colored pill-shaped badges" for active filter visibility.
 *
 * Touch-friendly: Uses Button component which enforces 44px minimum (WCAG 2.5.5)
 */
export function FilterChips({ filters, onRemoveFilter }: FilterChipsProps) {
  const activeFilters: Array<{ key: keyof FilterState; label: string; value: string }> = [];

  if (filters.startDate) {
    activeFilters.push({
      key: "startDate",
      label: "Start Date",
      value: new Date(filters.startDate).toLocaleDateString(),
    });
  }

  if (filters.endDate) {
    activeFilters.push({
      key: "endDate",
      label: "End Date",
      value: new Date(filters.endDate).toLocaleDateString(),
    });
  }

  if (filters.status) {
    activeFilters.push({
      key: "status",
      label: "Status",
      value: filters.status,
    });
  }

  if (filters.arrivalLocation) {
    activeFilters.push({
      key: "arrivalLocation",
      label: "Location",
      value: filters.arrivalLocation,
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2" role="list" aria-label="Active filters">
      {activeFilters.map((filter) => (
        <div
          key={filter.key}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-yellow-light border border-brand-yellow-dark text-lavender-deep text-sm font-medium"
          role="listitem"
        >
          <span className="text-xs text-muted-foreground">{filter.label}:</span>
          <span>{filter.value}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveFilter(filter.key)}
            className="h-5 w-5 p-0 hover:bg-brand-yellow-dark rounded-full"
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}
