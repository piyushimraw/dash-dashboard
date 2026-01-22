import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import LoginForm from '@/forms/login/LoginForm';
import { LOCATION_OPTIONS } from '@/forms/login/login.schema';


describe('LoginForm > FormSelect API behavior', () => {

  it('renders FormSelect options from API', async () => {
    // Mock API response for this test
    server.use(
      http.get('/api/locations', () => HttpResponse.json(LOCATION_OPTIONS))
    );

    render(<LoginForm />);

    await waitFor(() => {
      expect(screen.getByText('San Francisco, CA (Office 15)')).toBeInTheDocument();
      expect(screen.getByText('Los Angeles, CA (Office 02)')).toBeInTheDocument();
    });
  });



  it('handles empty array response', async () => {
    server.use(
      http.get('/api/locations', () => HttpResponse.json([]))
    );

    render(<LoginForm />);
    const select = await screen.findByLabelText(/login location/i);

    await userEvent.click(select);

    expect(
        screen.queryByText('San Francisco, CA (Office 15)')
    ).not.toBeInTheDocument();

    expect(
        screen.queryByText('Los Angeles, CA (Office 02)')
    ).not.toBeInTheDocument();
  });

  it('shows error when API fails', async () => {
    server.use(
      http.get('/api/locations', () => HttpResponse.error())
    );

    render(<LoginForm />);

    await waitFor(() => {
      expect(screen.getByText(/API error occurred/i)).toBeInTheDocument();
    });
  });

});
