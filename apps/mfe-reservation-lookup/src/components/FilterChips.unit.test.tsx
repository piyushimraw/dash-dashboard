import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterChips } from "./FilterChips";
import type { FilterState } from "../types/type";

/**
 * Mock Button from @packages/ui
 * Keep it minimal & semantic
 */
vi.mock("@packages/ui", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

describe("FilterChips", () => {
  const emptyFilters: FilterState = {
    startDate: "",
    endDate: "",
    status: "",
    arrivalLocation: "",
  };

  it("should render nothing when no filters are active", () => {
    const { container } = render(
      <FilterChips filters={emptyFilters} onRemoveFilter={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render chips for active filters", () => {
    const filters: FilterState = {
      startDate: "2025-01-01",
      endDate: "2025-01-05",
      status: "Confirmed",
      arrivalLocation: "DEL",
    };

    render(
      <FilterChips filters={filters} onRemoveFilter={vi.fn()} />
    );

    expect(screen.getByRole("list", { name: /active filters/i })).toBeInTheDocument();

    expect(screen.getByText("Start Date:")).toBeInTheDocument();
    expect(screen.getByText("End Date:")).toBeInTheDocument();
    expect(screen.getByText("Status:")).toBeInTheDocument();
    expect(screen.getByText("Location:")).toBeInTheDocument();

    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  it("should display formatted date values", () => {
    const filters: FilterState = {
      startDate: "2025-01-01",
      endDate: "",
      status: "",
      arrivalLocation: "",
    };

    render(
      <FilterChips filters={filters} onRemoveFilter={vi.fn()} />
    );

    const formattedDate = new Date("2025-01-01").toLocaleDateString();
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  it("should call onRemoveFilter with correct key when remove button is clicked", () => {
    const onRemoveFilter = vi.fn();

    const filters: FilterState = {
      startDate: "",
      endDate: "",
      status: "Confirmed",
      arrivalLocation: "",
    };

    render(
      <FilterChips filters={filters} onRemoveFilter={onRemoveFilter} />
    );

    const removeButton = screen.getByRole("button", {
      name: /remove status filter/i,
    });

    fireEvent.click(removeButton);

    expect(onRemoveFilter).toHaveBeenCalledTimes(1);
    expect(onRemoveFilter).toHaveBeenCalledWith("status");
  });

  it("should render accessible remove buttons for each filter", () => {
    const filters: FilterState = {
      startDate: "2025-01-01",
      endDate: "",
      status: "Confirmed",
      arrivalLocation: "",
    };

    render(
      <FilterChips filters={filters} onRemoveFilter={vi.fn()} />
    );

    expect(
      screen.getByRole("button", { name: /remove start date filter/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /remove status filter/i })
    ).toBeInTheDocument();
  });
});
