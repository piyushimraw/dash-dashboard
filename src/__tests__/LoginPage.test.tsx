import { render, screen, fireEvent , waitFor} from "@testing-library/react";
import {LoginPage} from "../pages/LoginPage";
import { describe, it, expect , vi} from "vitest";
import userEvent from '@testing-library/user-event';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import LoginForm from "@/forms/login/LoginForm";
import { renderWithQueryClient } from "./test-utils";

const EmailPlaceHolder = "Enter your user ID";
const PasswordPlaceHolder =  "Enter your password";

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(), // returns a mock function
}));

beforeEach(() => {
  server.resetHandlers(); // Reset handlers between tests
});

// test is checking whether the form UI renders, not whether it works.
describe("LoginPage", () => {
  it("renders login form fields", () => {
    renderWithQueryClient(<LoginPage />);
    expect(screen.getByPlaceholderText(EmailPlaceHolder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(PasswordPlaceHolder)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument(); // where name is sign in,  /i means case sensitive
  });
});


describe('LoginForm Integration - Form Validation', () => {
  it('shows validation errors when fields are empty', async () => {
    const user = userEvent.setup();

    renderWithQueryClient(<LoginForm />);

    // Click Sign In without filling any fields
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Assert validation messages for all required fields
    expect(await screen.findByText(/user id is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/user location is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/login location is required/i)).toBeInTheDocument();
  });
});


describe('LoginForm', () => {
  it('shows error message when credentials are wrong', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<LoginPage />);

    await user.type(screen.getByPlaceholderText(EmailPlaceHolder), 'wronguser');
    await user.type(screen.getByPlaceholderText(PasswordPlaceHolder), 'wrongpass');
    await user.type(screen.getByPlaceholderText(/Location/i), 'Bangalore');
    // await user.selectOptions(screen.getByLabelText(/Login Location/i), 'CASFO15');

    await screen.findByText('San Francisco, CA (Office 15)');
    await user.selectOptions(
      screen.getByLabelText(/Login Location/i),
      'CASFO15'
    );

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      await screen.findByText((text) => text?.includes('User ID or password is incorrect') ||text?.includes('API error occurred'))
    ).toBeInTheDocument();

  });
});


//Mock Service Worker
describe('LoginForm with MSW', () => {
  
  it('shows error message when credentials are invalid', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<LoginPage />);

    await user.type(screen.getByPlaceholderText(EmailPlaceHolder), 'wronguser');
    await user.type(screen.getByPlaceholderText(PasswordPlaceHolder), 'wrongpass');
    await user.type(screen.getByPlaceholderText(/Location/i), 'Bangalore');
   
    await screen.findByText('San Francisco, CA (Office 15)');
    await user.selectOptions(
        screen.getByLabelText(/Login Location/i),
        'CASFO15'
    );

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      await screen.findByText(/user id or password is incorrect/i)
    ).toBeInTheDocument();
  });

  
  it('logs in successfully with correct credentials', async () => {
    const user = userEvent.setup();
    renderWithQueryClient(<LoginPage />);

    await user.type(screen.getByPlaceholderText(EmailPlaceHolder), 'admin');
    await user.type(screen.getByPlaceholderText(PasswordPlaceHolder), 'admin123');
    await user.type(screen.getByPlaceholderText(/Location/i), 'Bangalore');
    // await user.selectOptions(screen.getByLabelText(/Login Location/i), 'CASFO15');


    await screen.findByText('San Francisco, CA (Office 15)');
    await user.selectOptions(
        screen.getByLabelText(/Login Location/i),
        'CASFO15'
    );

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      screen.queryByText(/user id or password is incorrect/i)
    ).not.toBeInTheDocument();
  });

  it('shows API error when server returns 500', async () => {
      const user = userEvent.setup();
      // Mock MSW to return 500 for login API
      server.use(
        http.post('/api/login', () => {
          return HttpResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
          );
        })
      );

      renderWithQueryClient(<LoginForm />);

      await user.type(screen.getByPlaceholderText(EmailPlaceHolder), 'admin');
      await user.type(screen.getByPlaceholderText(PasswordPlaceHolder), 'admin123');
      await user.type(screen.getByPlaceholderText(/location/i), 'Bangalore');
      // await user.selectOptions(screen.getByLabelText(/login location/i), 'CASFO15');

      await screen.findByText('San Francisco, CA (Office 15)');
      await user.selectOptions(
          screen.getByLabelText(/Login Location/i),
          'CASFO15'
      );

      // Click Sign In
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      // Assert API error message is shown
      await waitFor(() => {
        expect(screen.getByText('API error occurred')).toBeInTheDocument();
      });
});

});