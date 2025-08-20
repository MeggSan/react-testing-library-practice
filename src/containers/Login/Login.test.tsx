import { describe, it, expect, vi, Mock } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Login } from "./Login";
import { MemoryRouter } from "react-router-dom";
import { SessionProvider } from "../../context/AuthContext";
import { getAuth } from "../../services/getAuth";
import userEvent from "@testing-library/user-event";

vi.mock("../../services/getAuth.ts", () => ({
  getAuth: vi.fn(),
}));

const mockGetAuth = getAuth as Mock;

describe("<Login />", () => {
  it("should show an error message with invalid credentials", async () => {
    mockGetAuth.mockRejectedValue(new Error("Invalid credentials"));
    render(
      <SessionProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </SessionProvider>
    );
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
});
