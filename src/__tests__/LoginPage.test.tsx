import { render, screen, fireEvent } from "@testing-library/react";
import {LoginPage} from "../pages/LoginPage";
import { describe, it, expect } from "vitest";
import userEvent from '@testing-library/user-event';

const EmailPlaceHolder = "Enter your user ID";
const PasswordPlaceHolder =  "Enter your password";

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

    await user.type(screen.getByPlaceholderText(/Enter your user ID/i), 'wronguser');
    await user.type(screen.getByPlaceholderText(/Enter your password/i), 'wrongpass');
    await user.type(screen.getByPlaceholderText(/Location/i), 'Bangalore');
    await user.selectOptions(screen.getByLabelText(/Login Location/i), 'CASFO15');

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      await screen.findByText((text) => text.includes('User ID or password is incorrect'))
    ).toBeInTheDocument();
  });
});