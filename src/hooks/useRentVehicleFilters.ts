import type { FilterState, TableType } from "@/types/rent-vehicles/type";
import { useEffect, useState } from "react";

const initialFilters = {
  startDate: "",
  endDate: "",
  status: "",
};
export const useRentVehicleFilters = (data?: TableType[]) => {
  // Data shown in table
  const [filteredData, setFilteredData] = useState<TableType[]>([]);

  // UI state
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Sync initial / real data
  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  const hasActiveFilters =
    !!filters.startDate || !!filters.endDate || !!filters.status || !!search;

  //extract temp filters received from sidebar and initialize it to global state once clicked on submit
  const submitFilters = (filtersTemp: FilterState) => {
    if (!data) return;
    setFilters(filtersTemp);
    const { startDate, endDate, status } = filtersTemp;

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

  const resetFilters = () => {
    setFilters(initialFilters);
    setSearch("");
    setFilteredData(data ?? []);
  };

  return {
    initialFilters,
    filters,
    search,
    setSearch,
    filteredData,
    hasActiveFilters,
    submitFilters,
    resetFilters
  };
};
