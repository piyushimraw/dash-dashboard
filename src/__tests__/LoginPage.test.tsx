import { render, screen, fireEvent } from "@testing-library/react";
import {LoginPage} from "../pages/LoginPage";
import { describe, it, expect } from "vitest";


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

//checking if button is enabled after entering id and password
describe("LoginPage Button behavior in UI", () => {
  it("keeps Sign in button disabled until both fields are filled", () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(EmailPlaceHolder);
    const passwordInput = screen.getByPlaceholderText(PasswordPlaceHolder);
    const signInButton = screen.getByRole("button", { name: /sign in/i });

    // initially disabled
    expect(signInButton).toBeDisabled();

    // type email only
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    expect(signInButton).toBeDisabled();

    // type password too
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(signInButton).toBeEnabled();
  });
});
