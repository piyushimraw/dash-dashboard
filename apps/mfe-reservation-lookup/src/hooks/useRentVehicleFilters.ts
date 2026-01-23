import type { FilterState, TableType } from "../types/type";
import { useMemo, useState } from "react";

const initialFilters: FilterState = {
  startDate: "",
  endDate: "",
  status: "",
  arrivalLocation: "",
};

export const useRentVehicleFilters = (data: TableType[] = []) => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const hasActiveFilters =
    !!filters.startDate ||
    !!filters.endDate ||
    !!filters.status ||
    !!filters.arrivalLocation ||
    !!search;

  // Single source of filtering truth
  const filteredData = useMemo(() => {
    const searchValue = search.toLowerCase();

    return data.filter((item) => {
      const rentDate = new Date(item.rentDate).getTime();

      // Start date
      if (filters.startDate) {
        const start = new Date(filters.startDate).getTime();
        if (rentDate < start) return false;
      }

      // End date
      if (filters.endDate) {
        const end = new Date(filters.endDate).getTime();
        if (rentDate > end) return false;
      }

      // Status
      if (filters.status && item.resStatus !== filters.status) {
        return false;
      }

      // arrival location
      if (filters.arrivalLocation && item.arrivalLocation !== filters.arrivalLocation) {
        return false;
      }

      // Search
      if (searchValue) {
        return (
          item.customerName?.toLowerCase().includes(searchValue) ||
          item.email?.toLowerCase().includes(searchValue) ||
          item.phone?.toLowerCase().includes(searchValue)
        );
      }

      return true;
    });
  }, [data, filters, search]);

  // UI-only action
  const submitFilters = (filtersTemp: FilterState) => {
    setFilters(filtersTemp);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSearch("");
  };

  const removeFilter = (key: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  return {
    initialFilters,
    filters,
    search,
    setSearch,
    filteredData,
    hasActiveFilters,
    submitFilters,
    resetFilters,
    removeFilter,
  };
};
