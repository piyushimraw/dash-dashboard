import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { TablePagination } from './table-pagination';
import type { Table } from '@tanstack/react-table';

/* ---------------------------------------------------
   MOCK CHILD COMPONENTS
--------------------------------------------------- */

vi.mock('../select', () => ({
  Select: ({ children, onValueChange }: any) => (
    <div>
      <button onClick={() => onValueChange('10')}>change-page-size</button>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: () => <span>page-size</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../pagination/AppPagination', () => ({
  AppPagination: ({ onPageChange }: any) => (
    <button onClick={() => onPageChange(2)}>go-to-page-2</button>
  ),
}));

/* ---------------------------------------------------
   TABLE MOCK
--------------------------------------------------- */

function createTableMock(): Table<any> {
  return {
    getState: () => ({
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    }),
    getFilteredRowModel: () => ({
      rows: new Array(25).fill({}),
    }),
    setPageSize: vi.fn(),
    setPageIndex: vi.fn(),
  } as unknown as Table<any>;
}

/* ---------------------------------------------------
   TESTS
--------------------------------------------------- */

describe('TablePagination', () => {
  it('returns null when disabledPagination is true', () => {
    const table = createTableMock();

    const { container } = render(<TablePagination table={table} disabledPagination={true} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders rows per page selector and pagination', () => {
    const table = createTableMock();

    render(<TablePagination table={table} disabledPagination={false} />);

    expect(screen.getByText('Rows per page')).toBeInTheDocument();
    expect(screen.getByText('page-size')).toBeInTheDocument();
  });

  it('calls table.setPageSize when page size changes', () => {
    const table = createTableMock();

    render(<TablePagination table={table} disabledPagination={false} />);

    fireEvent.click(screen.getByText('change-page-size'));

    expect(table.setPageSize).toHaveBeenCalledWith(10);
  });

  it('calls table.setPageIndex when page changes', () => {
    const table = createTableMock();

    render(<TablePagination table={table} disabledPagination={false} />);

    fireEvent.click(screen.getByText('go-to-page-2'));

    expect(table.setPageIndex).toHaveBeenCalledWith(1);
  });
});
