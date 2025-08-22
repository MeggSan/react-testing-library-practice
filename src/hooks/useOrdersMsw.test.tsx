import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { useOrders } from "./useOrders";
import { SessionProvider, useSession } from "../context/AuthContext";

vi.mock("../context/AuthContext.tsx", async () => {
  const actual = await vi.importActual("../context/AuthContext.tsx");
  return {
    ...actual,
    useSession: vi.fn(),
  };
});

describe("useOrders MSW", () => {
  const mockUser = { id: "1", name: "Meggie Sanchez" };

  beforeEach(() => {
    (useSession as Mock).mockReturnValue({ user: mockUser });
  });

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <SessionProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </SessionProvider>
  );

  it("should obtain orders correctly", async () => {
    const { result } = renderHook(() => useOrders(), { wrapper });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.orders.length).toBe(1);
    });
  });

  it("should obtain an error", async () => {
    server.use(
      http.get("http://localhost:3001/orders", () => {
        return new HttpResponse(null, {
          status: 500,
          statusText: "Internal Server Error",
        });
      })
    );
    const { result } = renderHook(() => useOrders(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBe(
        "Failed to fetch orders. Please try again later"
      );
    });
  });
});
