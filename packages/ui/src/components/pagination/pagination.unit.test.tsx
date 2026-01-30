import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "./pagination";

describe("Pagination primitives", () => {
  it("renders Pagination with correct role and aria-label", () => {
    render(
      <Pagination>
        <PaginationContent />
      </Pagination>
    );

    const nav = screen.getByRole("navigation", { name: /pagination/i });
    expect(nav).toBeInTheDocument();
  });

  it("renders PaginationContent as a list", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>Item</PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByText("Item")).toBeInTheDocument();
  });

  it("renders PaginationLink with text", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("marks PaginationLink as active when isActive is true", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const link = screen.getByText("2");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveAttribute("data-active", "true");
  });

  it("renders PaginationPrevious with accessible label", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(
      screen.getByLabelText(/go to previous page/i)
    ).toBeInTheDocument();
  });

  it("renders PaginationNext with accessible label", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(
      screen.getByLabelText(/go to next page/i)
    ).toBeInTheDocument();
  });

  it("renders PaginationEllipsis and hides it from screen readers", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const ellipsis = screen.getByText(/more pages/i);
    expect(ellipsis).toBeInTheDocument();
    expect(ellipsis.parentElement).toHaveAttribute("aria-hidden");
  });
});
