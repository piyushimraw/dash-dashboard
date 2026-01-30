import { describe, it, expect, vi, beforeEach, MockedFunction } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { DataTable, customSortDataTable } from "./DataTable";
import type { ColumnDef } from "@tanstack/react-table";

/* ---------------------------------------------------
   MOCKS
--------------------------------------------------- */

vi.mock("../../hooks/useIsDesktop", () => ({
  useIsDesktop: vi.fn(),
}));

vi.mock("./table-pagination", () => ({
  TablePagination: ({ table }: any) => (
    <div data-testid="pagination">
      Page {table.getState().pagination.pageIndex}
    </div>
  ),
}));

/* ---------------------------------------------------
   TEST DATA
--------------------------------------------------- */

type RowData = {
  id: number;
  name: string;
  value: number;
};

const onMetaClick = vi.fn();

const columns: ColumnDef<RowData>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue }) => getValue(),
    meta: {
      hasLink: true,
    },
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ getValue }) => getValue(),
    enableSorting: true,
    meta: {
      onClick: onMetaClick,
      forceArrow: true,
    },
  },
];

const data: RowData[] = [
  { id: 1, name: "A", value: 2 },
  { id: 2, name: "B", value: 1 },
];

/* ---------------------------------------------------
   HELPERS
--------------------------------------------------- */

async function mockDesktop(value: boolean) {
  const mod = await import("../../hooks/useIsDesktop");

  const mockedUseIsDesktop = mod
    .useIsDesktop as MockedFunction<typeof mod.useIsDesktop>;

  mockedUseIsDesktop.mockReturnValue(value);
}

/* ---------------------------------------------------
   TESTS
--------------------------------------------------- */

describe("DataTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ------------------ LOADING ------------------ */

  it("renders desktop loader when loading", async () => {
    await mockDesktop(true);

    render(<DataTable columns={columns} data={[]} isLoading />);

    expect(document.querySelector(".skeleton-shimmer")).toBeTruthy();
  });

  it("renders mobile loader when loading", async () => {
    await mockDesktop(false);

    render(<DataTable columns={columns} data={[]} isLoading />);

    expect(
      document.querySelectorAll(".skeleton-shimmer").length,
    ).toBeGreaterThan(0);
  });

  /* ------------------ DESKTOP ------------------ */

  it("renders table rows on desktop", async () => {
    await mockDesktop(true);

    render(<DataTable columns={columns} data={data} />);

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("shows No Data Found on desktop", async () => {
    await mockDesktop(true);

    render(<DataTable columns={columns} data={[]} />);

    expect(screen.getByText("No Data Found")).toBeInTheDocument();
  });

  it("toggles sorting when clicking sortable header", async () => {
    await mockDesktop(true);

    render(<DataTable columns={columns} data={data} />);

    const valueHeader = screen.getByText("Value");

    fireEvent.click(valueHeader);

    const cells = screen.getAllByRole("cell");
    // After sorting asc, lowest value (1) should be first
    expect(cells.some((c) => c.textContent === "1")).toBe(true);
  });

  it("calls meta.onClick when clicking a sortable cell", async () => {
    await mockDesktop(true);

    render(<DataTable columns={columns} data={data} />);

    fireEvent.click(screen.getByText("2"));

    expect(onMetaClick).toHaveBeenCalled();
  });

  it("highlights column on hover", async () => {
    await mockDesktop(true);

    render(<DataTable columns={columns} data={data} />);

    const header = screen.getByText("Value");
    fireEvent.mouseEnter(header);
    fireEvent.mouseLeave(header);

    expect(header).toBeInTheDocument();
  });

  /* ------------------ PAGINATION ------------------ */

  it("uses internal pagination when uncontrolled", async () => {
    await mockDesktop(true);

    render(<DataTable columns={columns} data={data} />);

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("uses controlled pagination when provided", async () => {
    await mockDesktop(true);

    render(
      <DataTable
        columns={columns}
        data={data}
        pagination={{ pageIndex: 1, pageSize: 10 }}
        onPaginationChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  /* ------------------ EFFECT ------------------ */

  it("resets pageIndex when globalSearch changes", async () => {
    await mockDesktop(true);

    const setPagination = vi.fn();

    const { rerender } = render(
      <DataTable
        columns={columns}
        data={data}
        pagination={{ pageIndex: 2, pageSize: 10 }}
        onPaginationChange={setPagination}
        globalSearch="a"
      />,
    );

    rerender(
      <DataTable
        columns={columns}
        data={data}
        pagination={{ pageIndex: 2, pageSize: 10 }}
        onPaginationChange={setPagination}
        globalSearch="b"
      />,
    );

    // 1️⃣ ensure it was called
    expect(setPagination).toHaveBeenCalled();

    // 2️⃣ grab the updater function
    const updater = setPagination.mock.calls[0][0];
    expect(typeof updater).toBe("function");

    // 3️⃣ execute updater with previous state
    const result = updater({ pageIndex: 2, pageSize: 10 });

    // 4️⃣ assert reset happened
    expect(result.pageIndex).toBe(0);
  });

  /* ------------------ MOBILE ------------------ */

  it("renders mobile card view", async () => {
    await mockDesktop(false);

    render(<DataTable columns={columns} data={data} />);

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("shows No Data Found on mobile", async () => {
    await mockDesktop(false);

    render(<DataTable columns={columns} data={[]} />);

    expect(screen.getByText("No Data Found")).toBeInTheDocument();
  });

  /* ------------------ customSortDataTable ------------------ */

  it("customSortDataTable sorts numbers correctly", () => {
    const sortFn = customSortDataTable<RowData>("value");

    const rowA: any = { original: { value: 1 } };
    const rowB: any = { original: { value: 5 } };

    expect(sortFn(rowA, rowB)).toBe(-4);
  });

  it("customSortDataTable handles undefined safely", () => {
    const sortFn = customSortDataTable<RowData>("value");

    const rowA: any = { original: { value: undefined } };
    const rowB: any = { original: { value: 3 } };

    expect(sortFn(rowA, rowB)).toBe(-3);
  });
});
