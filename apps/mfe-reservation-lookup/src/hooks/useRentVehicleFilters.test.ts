import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRentVehicleFilters } from "./useRentVehicleFilters";
import { rentedVehiclesMock } from "../utils";
vi.mock("@packages/ui", () => ({
  DEFAULT_PAGE_INDEX: 0,
  DEFAULT_ITEMS_SIZE: 10,
}));

describe("useRentVehicleFilters", () => {
  it("should initialize with full data and default values", () => {
    const { result } = renderHook(() =>
      useRentVehicleFilters(rentedVehiclesMock),
    );

    expect(result.current.filteredData).toHaveLength(5);
    expect(result.current.search).toBe("");
    expect(result.current.filters.status).toBe("All");
    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.pagination.pageIndex).toBe(0);
  });

  it("should filter by search (customer name)", () => {
    const { result } = renderHook(() =>
      useRentVehicleFilters(rentedVehiclesMock),
    );

    act(() => {
      result.current.setSearch("sarah");
    });

    expect(result.current.filteredData).toHaveLength(1);
    expect(result.current.filteredData[0].customerName).toBe("Sarah Davis");
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it("should filter by email search", () => {
    const { result } = renderHook(() =>
      useRentVehicleFilters(rentedVehiclesMock),
    );

    act(() => {
      result.current.setSearch("michael@test.com");
    });

    expect(result.current.filteredData).toHaveLength(1);
    expect(result.current.filteredData[0].id).toBe("5");
  });

  it("should filter by status = Confirmed", () => {
    const { result } = renderHook(() =>
      useRentVehicleFilters(rentedVehiclesMock),
    );

    act(() => {
      result.current.submitFilters({
        startDate: "",
        endDate: "",
        status: "Confirmed",
        arrivalLocation: "",
      });
    });

    expect(result.current.filteredData).toHaveLength(2);
    expect(
      result.current.filteredData.every(
        (item) => item.resStatus === "Confirmed",
      ),
    ).toBe(true);
  });

  it("should filter by arrival location DEL", () => {
    const { result } = renderHook(() =>
      useRentVehicleFilters(rentedVehiclesMock),
    );

    act(() => {
      result.current.submitFilters({
        startDate: "",
        endDate: "",
        status: "All",
        arrivalLocation: "DEL",
      });
    });

    expect(result.current.filteredData).toHaveLength(2);
    expect(
      result.current.filteredData.every(
        (item) => item.arrivalLocation === "DEL",
      ),
    ).toBe(true);
  });

  it("should filter by date range (Jan 2025 only)", () => {
    const { result } = renderHook(() =>
      useRentVehicleFilters(rentedVehiclesMock),
    );

    act(() => {
      result.current.submitFilters({
        startDate: "2025-01-01",
        endDate: "2025-01-31",
        status: "All",
        arrivalLocation: "",
      });
    });

    expect(result.current.filteredData).toHaveLength(3);
    expect(result.current.filteredData.map((i) => i.id)).toEqual([
      "1",
      "2",
      "4",
    ]);
  });

  it("should combine filters (status + location)", () => {
    const { result } = renderHook(() =>
      useRentVehicleFilters(rentedVehiclesMock),
    );

    act(() => {
      result.current.submitFilters({
        startDate: "",
        endDate: "",
        status: "Completed",
        arrivalLocation: "DEL",
      });
    });

    expect(result.current.filteredData).toHaveLength(1);
    expect(result.current.filteredData[0].customerName).toBe("Michael Johnson");
  });

  it("should reset pagination when search changes", () => {
    const { result } = renderHook(() =>
      useRentVehicleFilters(rentedVehiclesMock),
    );

    act(() => {
      result.current.setPagination((prev) => ({
        ...prev,
        pageIndex: 2,
      }));
    });

    act(() => {
      result.current.setSearch("john");
    });

    expect(result.current.pagination.pageIndex).toBe(0);
  });

  it("should remove specific filter", () => {
    const { result } = renderHook(() =>
      useRentVehicleFilters(rentedVehiclesMock),
    );

    act(() => {
      result.current.submitFilters({
        startDate: "2025-01-01",
        endDate: "",
        status: "Confirmed",
        arrivalLocation: "DEL",
      });
    });

    act(() => {
      result.current.removeFilter("startDate");
    });
    expect(result.current.filters.startDate).toBe("");
  });

  it("should reset filters and search", () => {
    const { result } = renderHook(() =>
      useRentVehicleFilters(rentedVehiclesMock),
    );

    act(() => {
      result.current.setSearch("john");
      result.current.submitFilters({
        startDate: "2025-01-01",
        endDate: "",
        status: "Confirmed",
        arrivalLocation: "DEL",
      });
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.search).toBe("");
    expect(result.current.filters.status).toBe("All");
    expect(result.current.filteredData).toHaveLength(5);
    expect(result.current.hasActiveFilters).toBe(false);
  });
});
