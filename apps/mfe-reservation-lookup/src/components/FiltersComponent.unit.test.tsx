import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { FiltersComponent } from './FiltersComponent';
import type { FilterState } from '../types/type';

/* -------------------- mocks -------------------- */

vi.mock('@packages/ui', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Input: ({ value, onChange, ...props }: any) => (
    <input value={value} onChange={onChange} {...props} />
  ),
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
  SelectBox: ({ label, value, onValueChange, options }: any) => (
    <label>
      {label}
      <select value={value} onChange={(e) => onValueChange(e.target.value)}>
        {options.map((o: any) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  ),
}));

vi.mock('./ResponsiveFilterPanel', () => ({
  ResponsiveFilterPanel: ({ open, onOpenChange, trigger, children }: any) => (
    <div>
      <div onClick={() => onOpenChange(true)}>{trigger}</div>
      {open && <div data-testid="filter-panel">{children}</div>}
    </div>
  ),
}));

/* -------------------- helpers -------------------- */

const initialFilters: FilterState = {
  startDate: '',
  endDate: '',
  status: 'All',
  arrivalLocation: '',
};

/* -------------------- tests -------------------- */

describe('FiltersComponent', () => {
  it('renders Filter button', () => {
    render(
      <FiltersComponent
        initialFilters={initialFilters}
        filters={initialFilters}
        resetFilters={vi.fn()}
        hasActiveFilters={false}
        submitFilters={vi.fn()}
      />,
    );

    expect(screen.getByText(/filter/i)).toBeInTheDocument();
  });

  it('shows active filter indicator when hasActiveFilters is true', () => {
    render(
      <FiltersComponent
        initialFilters={initialFilters}
        filters={{ ...initialFilters, status: 'Confirmed' }}
        resetFilters={vi.fn()}
        hasActiveFilters={true}
        submitFilters={vi.fn()}
      />,
    );

    expect(screen.getByText('!')).toBeInTheDocument();
  });

  it('opens filter panel when filter button is clicked', () => {
    render(
      <FiltersComponent
        initialFilters={initialFilters}
        filters={initialFilters}
        resetFilters={vi.fn()}
        hasActiveFilters={false}
        submitFilters={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText(/filter/i));

    expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply filters/i })).toBeInTheDocument();
  });

  it('applies filters and calls submitFilters with updated values', () => {
    const submitFilters = vi.fn();

    render(
      <FiltersComponent
        initialFilters={initialFilters}
        filters={initialFilters}
        resetFilters={vi.fn()}
        hasActiveFilters={false}
        submitFilters={submitFilters}
      />,
    );

    fireEvent.click(screen.getByText(/filter/i));

    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: '2025-01-01' },
    });

    fireEvent.change(screen.getByLabelText(/arrival location/i), {
      target: { value: 'DEL' },
    });

    fireEvent.click(screen.getByText(/apply filters/i));

    expect(submitFilters).toHaveBeenCalledWith({
      startDate: '2025-01-01',
      endDate: '',
      status: 'All',
      arrivalLocation: 'DEL',
    });
  });

  it('resets filters when Reset All is clicked', () => {
    const resetFilters = vi.fn();

    render(
      <FiltersComponent
        initialFilters={initialFilters}
        filters={{
          startDate: '2025-01-01',
          endDate: '',
          status: 'Confirmed',
          arrivalLocation: 'DEL',
        }}
        resetFilters={resetFilters}
        hasActiveFilters={true}
        submitFilters={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText(/filter/i));
    fireEvent.click(screen.getByText(/reset all/i));

    expect(resetFilters).toHaveBeenCalledTimes(1);
  });

  it('shows global Reset button only when hasActiveFilters is true', () => {
    const { rerender } = render(
      <FiltersComponent
        initialFilters={initialFilters}
        filters={initialFilters}
        resetFilters={vi.fn()}
        hasActiveFilters={false}
        submitFilters={vi.fn()}
      />,
    );

    expect(screen.queryByText(/reset/i)).not.toBeInTheDocument();

    rerender(
      <FiltersComponent
        initialFilters={initialFilters}
        filters={{ ...initialFilters, status: 'Confirmed' }}
        resetFilters={vi.fn()}
        hasActiveFilters={true}
        submitFilters={vi.fn()}
      />,
    );

    expect(screen.getByText(/reset/i)).toBeInTheDocument();
  });
});
