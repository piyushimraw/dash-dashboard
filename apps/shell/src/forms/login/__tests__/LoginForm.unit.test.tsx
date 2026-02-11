import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/forms/login/LoginForm';
import { LoginPage } from '@/pages/LoginPage';
import { renderWithQueryClient } from '@/tests/utils/test-utils';

const EmailPlaceHolder = 'Enter your user ID';
const PasswordPlaceHolder = 'Enter your password';

// vi.mock('@tanstack/react-router', () => ({
//   useNavigate: () => vi.fn(), // returns a mock function
// }));

// beforeEach(() => {
//   server.resetHandlers(); // Reset handlers between tests
// });

// test is checking whether the form UI renders, not whether it works.
describe('LoginPage', () => {
  it('renders login form fields', () => {
    renderWithQueryClient(<LoginPage />);
    expect(screen.getByPlaceholderText(EmailPlaceHolder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(PasswordPlaceHolder)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument(); // where name is sign in,  /i means case sensitive
  });
});

describe('LoginForm - Form Validation', () => {
  it('shows validation errors when fields are empty', async () => {
    const user = userEvent.setup();

    renderWithQueryClient(<LoginForm />);

    // Click Sign In without filling any fields
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Assert validation messages for all required fields
    expect(await screen.findByText(/user id is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
    // expect(await screen.findByText(/user location is required/i)).toBeInTheDocument();
    // expect(await screen.findByText(/login location is required/i)).toBeInTheDocument();
  });
});
