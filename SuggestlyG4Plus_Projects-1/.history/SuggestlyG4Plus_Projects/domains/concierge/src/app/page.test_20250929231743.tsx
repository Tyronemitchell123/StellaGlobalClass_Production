import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ConciergeLandingPage from "./page";

describe("ConciergeLandingPage", () => {
  beforeEach(() => {
    render(<ConciergeLandingPage />);
  });

  test("renders hero section with title and subtitle", () => {
    expect(screen.getByText(/Comprehensive AI Concierge/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Experience the future of premium lifestyle management/i)
    ).toBeInTheDocument();
  });

  test("renders navigation menu links", () => {
    expect(screen.getByRole("link", { name: /Services/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Membership/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Exclusive Access/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Contact/i })).toBeInTheDocument();
  });

  test("toggles mobile menu when hamburger clicked", () => {
    const toggleButton =
      screen.getByRole("button", { hidden: true }) ||
      screen.getByTestId("mobileMenu");
    if (toggleButton) {
      fireEvent.click(toggleButton);
      const menu = screen.getByRole("list");
      expect(menu).toHaveClass("active");
      fireEvent.click(toggleButton);
      expect(menu).not.toHaveClass("active");
    }
  });

  test("renders services section with service cards", () => {
    expect(screen.getByText(/Technology Solutions/i)).toBeInTheDocument();
    expect(screen.getByText(/Healthcare Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Education Platform/i)).toBeInTheDocument();
  });

  test("renders membership tiers", () => {
    expect(screen.getByText(/Silver/i)).toBeInTheDocument();
    expect(screen.getByText(/Gold/i)).toBeInTheDocument();
    expect(screen.getByText(/Platinum/i)).toBeInTheDocument();
    expect(screen.getByText(/Diamond/i)).toBeInTheDocument();
  });

  test("renders contact information", () => {
    expect(screen.getByText(/Get in Touch/i)).toBeInTheDocument();
    expect(screen.getByText(/\+1 \(888\) VERIDIAN/i)).toBeInTheDocument();
    expect(
      screen.getByText(/concierge@veridianprivate.com/i)
    ).toBeInTheDocument();
  });

  test("validates form submission", async () => {
    const submitButton = screen.getByRole("button", {
      name: /Request Exclusive Access/i,
    });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Please fill in all required fields."
      );
    });
  });

  test("submits form successfully", async () => {
    window.alert = jest.fn();
    const fullNameInput = screen.getByLabelText(/Full Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const submitButton = screen.getByRole("button", {
      name: /Request Exclusive Access/i,
    });

    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Thank you for your interest! Our concierge team will contact you within 24 hours."
      );
    });
  });
});
