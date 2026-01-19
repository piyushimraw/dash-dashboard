import type { FilterState, TableType } from "@/types/rent-vehicles/type";
import { useEffect, useState } from "react";

export const useRentVehicleFilters = (data?: TableType[]) => {
  // Data shown in table
  const [filteredData, setFilteredData] = useState<TableType[]>([]);

  // UI state
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    startDate: "",
    endDate: "",
    status: "",
  });

  // Sync initial / real data
  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const hasActiveFilters =
    filters.startDate || filters.endDate || filters.status || search;

  const submitFilters = () => {
    if (!data) return;

    const { startDate, endDate, status } = filters;

    const result = data.filter((item) => {
      const rentDate = new Date(item.rentDate).getTime();

      if (startDate) {
        const start = new Date(startDate).getTime();
        if (rentDate < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate).getTime();
        if (rentDate > end) return false;
      }

      if (status && item.status !== status) {
        return false;
      }

      if (search) {
        return Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
      }

      return true;
    });

    setFilteredData(result);
  };

  const handleResetFilters = () => {
    setFilters({ startDate: "", endDate: "", status: "" });
    setSearch("");
    setFilteredData(data ?? []);
  };

  return {
    filters,
    search,
    setSearch,
    filteredData,
    hasActiveFilters,
    submitFilters,
    handleResetFilters,
    handleFilterChange,
  };
};
