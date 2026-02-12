import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { SearchComponent } from './SearchComponent';

/* ---------------- mocks ---------------- */

const setSearch = vi.fn();

vi.mock('@packages/ui', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Input: ({ value, onChange, ...props }: any) => (
    <input value={value} onChange={onChange} {...props} />
  ),
  useIsDesktop: vi.fn(),
}));

import { useIsDesktop } from '@packages/ui';

/* ---------------- helpers ---------------- */

const renderComponent = (props?: Partial<React.ComponentProps<typeof SearchComponent>>) =>
  render(<SearchComponent search="" setSearch={setSearch} {...props} />);

beforeEach(() => {
  vi.clearAllMocks();
});

/* ---------------- tests ---------------- */

describe('SearchComponent – Desktop', () => {
  it('renders input on desktop', () => {
    (useIsDesktop as any).mockReturnValue(true);

    renderComponent();

    expect(screen.getByPlaceholderText(/customer name \/ email \/ phone/i)).toBeInTheDocument();
  });

  it('calls setSearch when typing', () => {
    (useIsDesktop as any).mockReturnValue(true);

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/customer name/i), { target: { value: 'john' } });

    expect(setSearch).toHaveBeenCalledWith('john');
  });

  it('shows clear button only when search has value', () => {
    (useIsDesktop as any).mockReturnValue(true);

    renderComponent({ search: 'john' });

    expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
  });

  it('clears search when clear button is clicked', () => {
    (useIsDesktop as any).mockReturnValue(true);

    renderComponent({ search: 'john' });

    fireEvent.click(screen.getByRole('button', { name: /clear search/i }));

    expect(setSearch).toHaveBeenCalledWith('');
  });
});

describe('SearchComponent – Mobile', () => {
  it('renders collapsed search button initially', () => {
    (useIsDesktop as any).mockReturnValue(false);

    renderComponent();

    expect(screen.getByRole('button', { name: /open search/i })).toBeInTheDocument();
  });

  it('expands input when search button is clicked', () => {
    (useIsDesktop as any).mockReturnValue(false);

    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /open search/i }));

    expect(screen.getByPlaceholderText(/customer name \/ email \/ phone/i)).toBeInTheDocument();
  });

  it('clears search and collapses input on mobile', () => {
    (useIsDesktop as any).mockReturnValue(false);

    renderComponent({ search: 'john' });

    // expand
    fireEvent.click(screen.getByRole('button', { name: /open search/i }));

    fireEvent.click(screen.getByRole('button', { name: /clear search/i }));

    expect(setSearch).toHaveBeenCalledWith('');

    // collapsed again
    expect(screen.getByRole('button', { name: /open search/i })).toBeInTheDocument();
  });
});
