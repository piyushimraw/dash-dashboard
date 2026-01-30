import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AppPagination } from "./AppPagination";

describe("AppPagination", () => {
  it("renders page numbers correctly", () => {
    render(
      <AppPagination
        page={1}
        pageSize={10}
        totalItems={50}
        onPageChange={vi.fn()}
      />,
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("calls onPageChange when clicking a page", () => {
    const onPageChange = vi.fn();

    render(
      <AppPagination
        page={1}
        pageSize={10}
        totalItems={50}
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(screen.getByText("2"));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("goes to next page when clicking Next", () => {
    const onPageChange = vi.fn();

    render(
      <AppPagination
        page={2}
        pageSize={10}
        totalItems={50}
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(screen.getByLabelText(/next/i));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("goes to previous page when clicking Previous", () => {
    const onPageChange = vi.fn();

    render(
      <AppPagination
        page={3}
        pageSize={10}
        totalItems={50}
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(screen.getByLabelText(/previous/i));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("disables Previous button on first page", () => {
    const onPageChange = vi.fn();

    render(
      <AppPagination
        page={1}
        pageSize={10}
        totalItems={50}
        onPageChange={onPageChange}
      />,
    );

    const prev = screen.getByLabelText(/previous/i);

    expect(prev).toHaveAttribute("aria-disabled", "true");

    fireEvent.click(prev);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("does not render pagination if only one page", () => {
    const { container } = render(
      <AppPagination
        page={1}
        pageSize={10}
        totalItems={5}
        onPageChange={vi.fn()}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("respects disabled prop", () => {
    const onPageChange = vi.fn();

    render(
      <AppPagination
        page={2}
        pageSize={10}
        totalItems={50}
        disabled
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(screen.getByLabelText(/next/i));
    fireEvent.click(screen.getByLabelText(/previous/i));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("renders all pages when total pages are small (no ellipsis)", () => {
    render(
      <AppPagination
        page={1}
        pageSize={10}
        totalItems={30} // 3 pages
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    // no ellipsis
    expect(screen.queryByText(/more pages/i)).not.toBeInTheDocument();
  });

  it("renders ellipsis when pages exceed sibling range", () => {
    render(
      <AppPagination
        page={5}
        pageSize={10}
        totalItems={200} // 20 pages
        siblingCount={1}
        onPageChange={vi.fn()}
      />,
    );

    // Ellipsis rendered
    expect(screen.getAllByText(/more pages/i).length).toBeGreaterThan(0);

    // First & last page always visible
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("marks the current page as active", () => {
    render(
      <AppPagination
        page={3}
        pageSize={10}
        totalItems={50}
        onPageChange={vi.fn()}
      />,
    );

    const activePage = screen.getByText("3");

    expect(activePage).toHaveAttribute("aria-current", "page");
  });

  it("disables Next button on last page", () => {
    const onPageChange = vi.fn();

    render(
      <AppPagination
        page={5}
        pageSize={10}
        totalItems={50}
        onPageChange={onPageChange}
      />,
    );

    const next = screen.getByLabelText(/next/i);

    expect(next).toHaveAttribute("aria-disabled", "true");

    fireEvent.click(next);
    expect(onPageChange).not.toHaveBeenCalled();
  });
});
