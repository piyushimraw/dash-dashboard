import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import LoginForm from '@/forms/login/LoginForm';
import { LOCATION_OPTIONS } from '@/forms/login/login.schema';
import { LOGIN_LOCATION_LIST_API } from '@/features/login-location/api/getLoginLocation';
import { server } from '@/tests/mocks/server';
import { renderWithQueryClient } from '@/tests/utils/test-utils';


describe('LoginForm > FormSelect API behavior', () => {

  it('renders FormSelect options from API', async () => {
    
  server.use(
    http.get(LOGIN_LOCATION_LIST_API, () => 
      HttpResponse.json(LOCATION_OPTIONS)
    ));

    renderWithQueryClient(<LoginForm />);

    await waitFor(() => {
      expect(screen.getByText('San Francisco, CA (Office 15)')).toBeInTheDocument();
      expect(screen.getByText('Los Angeles, CA (Office 02)')).toBeInTheDocument();
    });
  });

  it('handles empty array response', async () => {
    server.use(
    http.get(LOGIN_LOCATION_LIST_API, () => 
      HttpResponse.json([])
    )
  );

    renderWithQueryClient(<LoginForm />);
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
      http.get(LOGIN_LOCATION_LIST_API, () => {
        return HttpResponse.json({ message: 'Server error' }, { status: 500 });
      })
    );

    renderWithQueryClient(<LoginForm />);
    
    const errorMessage = await screen.findByText('API error occurred');
    expect(errorMessage).toBeInTheDocument();
});
});
