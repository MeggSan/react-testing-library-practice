import { describe, it, expect, vi, Mock } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { SessionProvider, useSession } from "./context/AuthContext";
import App from "./App";

vi.mock("./context/AuthContext", async () => {
  const actual = await vi.importActual("./context/AuthContext");
  return {
    ...actual,
    useSession: vi.fn(),
  };
});

const mockUseSession = useSession as Mock;

describe("<App />", () => {
  it("should render Login component on default route /", () => {
    mockUseSession.mockReturnValue({ user: null });

    render(
      <SessionProvider>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </SessionProvider>
    );

    const buttonLogin = screen.getByRole("button", { name: "Login" });
    expect(buttonLogin).toBeInTheDocument();
  });

  it("should render Orders component on /orders route", async () => {
    mockUseSession.mockReturnValue({ user: { role: "visualizer" } });

    render(
      <SessionProvider>
        <MemoryRouter initialEntries={["/orders"]}>
          <App />
        </MemoryRouter>
      </SessionProvider>
    );

    await waitFor(() => {
      const ordersText = screen.getByText("Order History");
      expect(ordersText).toBeInTheDocument();
    });
  });
});
