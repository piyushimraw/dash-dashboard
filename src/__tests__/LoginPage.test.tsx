import { render, screen, fireEvent } from "@testing-library/react";
import {LoginPage} from "../pages/LoginPage";
import { describe, it, expect , vi} from "vitest";
import userEvent from '@testing-library/user-event';
import { server } from '@/mocks/server';

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
    render(<LoginPage />);
    expect(screen.getByPlaceholderText(EmailPlaceHolder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(PasswordPlaceHolder)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument(); // where name is sign in,  /i means case sensitive
  });
});


describe('LoginForm', () => {
  it('shows error message when credentials are wrong', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByPlaceholderText(EmailPlaceHolder), 'wronguser');
    await user.type(screen.getByPlaceholderText(PasswordPlaceHolder), 'wrongpass');
    await user.type(screen.getByPlaceholderText(/Location/i), 'Bangalore');
    await user.selectOptions(screen.getByLabelText(/Login Location/i), 'CASFO15');

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
    render(<LoginPage />);

    await user.type(screen.getByPlaceholderText(EmailPlaceHolder), 'wronguser');
    await user.type(screen.getByPlaceholderText(PasswordPlaceHolder), 'wrongpass');
    await user.type(screen.getByPlaceholderText(/Location/i), 'Bangalore');
    await user.selectOptions(screen.getByLabelText(/Login Location/i), 'CASFO15');

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      await screen.findByText(/user id or password is incorrect/i)
    ).toBeInTheDocument();

    // expect(
    //   await screen.findByText((text) => text?.includes('User ID or password is incorrect') || text?.includes('API error occurred'))
    // ).toBeInTheDocument();

  });

  it('logs in successfully with correct credentials', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByPlaceholderText(EmailPlaceHolder), 'admin');
    await user.type(screen.getByPlaceholderText(PasswordPlaceHolder), 'admin123');
    await user.type(screen.getByPlaceholderText(/Location/i), 'Bangalore');
    await user.selectOptions(screen.getByLabelText(/Login Location/i), 'CASFO15');

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      screen.queryByText(/user id or password is incorrect/i)
    ).not.toBeInTheDocument();
  });
});