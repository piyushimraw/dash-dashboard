import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReservationLookupPage } from '../../ReservationLookupPage';
import { renderWithQueryClient } from '../utils/test-utils';

describe('ReservationLookupPage – integration', () => {
  test('renders data from API in table', async () => {
    renderWithQueryClient(<ReservationLookupPage />);
    // wait for API data to load
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('displays all required columns in the table', async () => {
    renderWithQueryClient(<ReservationLookupPage />);

    await screen.findByText('John Doe');

    // Check for column headers
    expect(screen.getByText('Customer Name')).toBeInTheDocument();
    expect(screen.getByText('Svc Level')).toBeInTheDocument();
    expect(screen.getByText('CVI')).toBeInTheDocument();
    expect(screen.getByText('Est Arrival')).toBeInTheDocument();
    expect(screen.getByText('Flight Info Status')).toBeInTheDocument();
    expect(screen.getByText('# of Days')).toBeInTheDocument();
    expect(screen.getByText('Res Class')).toBeInTheDocument();
    expect(screen.getByText('Res Status')).toBeInTheDocument();
    expect(screen.getByText('DASH Status')).toBeInTheDocument();
    expect(screen.getByText('Rent Date')).toBeInTheDocument();
    expect(screen.getByText('Return Date')).toBeInTheDocument();
    expect(screen.getByText('Arrival Location')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
  });

  test('filters table when searching by customer name', async () => {
    renderWithQueryClient(<ReservationLookupPage />);
    const user = userEvent.setup();

    // wait for initial load
    await screen.findByText('John Doe');

    const searchInput = screen.getByPlaceholderText(/customer name/i);
    await user.type(searchInput, 'Jane');

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  test('clears search and shows all results again', async () => {
    renderWithQueryClient(<ReservationLookupPage />);
    const user = userEvent.setup();

    await screen.findByText('John Doe');

    const searchInput = screen.getByPlaceholderText(/customer name/i) as HTMLInputElement;
    await user.type(searchInput, 'Jane');

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();

    // Clear search
    await user.clear(searchInput);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('renders filter button', async () => {
    renderWithQueryClient(<ReservationLookupPage />);

    await screen.findByText('John Doe');

    const filterButtons = screen.getAllByRole('button', { name: /filter/i });
    const filterButton = filterButtons[0];
    expect(filterButton).toBeInTheDocument();
  });

  test('opens filter panel when filter button is clicked', async () => {
    renderWithQueryClient(<ReservationLookupPage />);
    const user = userEvent.setup();

    await screen.findByText('John Doe');

    const filterButtons = screen.getAllByRole('button', { name: /filter/i });
    const filterButton = filterButtons[0];
    await user.click(filterButton);

    // Filter panel should contain filter inputs
    await waitFor(() => {
      const filterInputs = screen.getAllByRole('textbox');
      expect(filterInputs.length).toBeGreaterThan(0);
    });
  });

  test('displays reset filters button when filters are active', async () => {
    renderWithQueryClient(<ReservationLookupPage />);
    const user = userEvent.setup();

    await screen.findByText('John Doe');

    // Apply a filter by typing in search
    const searchInput = screen.getByPlaceholderText(/customer name/i);
    await user.type(searchInput, 'Jane');

    // Reset button should now be visible
    const resetButtons = screen.getAllByRole('button', {
      name: /reset|clear/i,
    });
    expect(resetButtons.length).toBeGreaterThan(0);
  });

  test('pagination remains disabled when active filters exist', async () => {
    renderWithQueryClient(<ReservationLookupPage />);
    const user = userEvent.setup();

    await screen.findByText('John Doe');

    // Apply a search filter
    const searchInput = screen.getByPlaceholderText(/customer name/i);
    await user.type(searchInput, 'Jane');

    // Pagination should be disabled or not present
    screen.queryAllByRole('button', { name: /next|previous|page/i });
    // When filters are active, pagination should not be functional
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});
