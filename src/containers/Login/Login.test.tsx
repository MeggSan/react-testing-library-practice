import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import {
  // act,
  // fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Login } from "./Login";
import { MemoryRouter } from "react-router-dom";
import { SessionProvider } from "../../context/AuthContext";
import { getAuth } from "../../services/getAuth";
import userEvent from "@testing-library/user-event";

vi.mock("../../services/getAuth.ts", () => ({
  getAuth: vi.fn(),
}));

const mockGetAuth = getAuth as Mock;
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("<Login />", () => {
  beforeEach(() => {
    render(
      <SessionProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </SessionProvider>
    );
  });

  it("should show an error message with invalid credentials", async () => {
    mockGetAuth.mockRejectedValue(new Error("Invalid credentials"));
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const buttonLogin = screen.getByRole("button", { name: "Login" });
    const username = "wrongUsername";
    const password = "wrongPassword";
    // await act(() => {
    //   fireEvent.change(usernameInput, { target: { value: username } });
    //   fireEvent.change(passwordInput, { target: { value: password } });
    //   fireEvent.click(buttonLogin);
    // });
    await userEvent.type(usernameInput, username);
    await userEvent.type(passwordInput, password);
    await userEvent.click(buttonLogin);
    const errorMessage = screen.getByText("Invalid credentials");
    expect(errorMessage).toBeInTheDocument();
  });

  it("should navigate to /orders after login", async () => {
    mockGetAuth.mockResolvedValue({ success: true });

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const buttonLogin = screen.getByRole("button", { name: "Login" });
    const username = "validUser";
    const password = "validPassword";
    // await act(() => {
    //   fireEvent.change(usernameInput, { target: { value: username } });
    //   fireEvent.change(passwordInput, { target: { value: password } });
    //   fireEvent.click(buttonLogin);
    // });
    await userEvent.clear(usernameInput);
    await userEvent.type(usernameInput, username);
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, password);
    await userEvent.click(buttonLogin);
    await waitFor(() => {
      expect(mockGetAuth).toHaveBeenCalledWith(username, password);
      expect(mockNavigate).toHaveBeenCalledWith("/orders");
    });
  });

  it("should show password after clicking in the show button", async () => {
    const passwordInput = screen.getByPlaceholderText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");
    const buttonShow = screen.getByRole("button", { name: "show" });
    await userEvent.click(buttonShow);
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(buttonShow).toHaveTextContent("hide");
  });
});
