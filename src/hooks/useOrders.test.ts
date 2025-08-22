import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { useSession } from "../context/AuthContext";
import { getOrders } from "../services/getOrders";
import { useOrders } from "./useOrders";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("../context/AuthContext.tsx", async () => {
  const actual = await vi.importActual("../context/AuthContext.tsx");
  return {
    ...actual,
    useSession: vi.fn(),
  };
});

vi.mock("../services/getOrders.ts", () => ({
  getOrders: vi.fn(),
}));

const mockGetOrders = getOrders as Mock;
const mockUseSession = useSession as Mock;
const mockOrders = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    customer: {
      id: "60d07f61-99bf-4b90-955b-5d3a7c9bb3d4",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    products: [
      {
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
        name: "Laptop",
        price: 999.99,
        quantity: 1,
      },
      {
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
        name: "Mouse",
        price: 29.99,
        quantity: 1,
      },
    ],
    total: 1029.98,
    status: "delivered",
    orderDate: "2023-10-01T10:00:00Z",
    shippingAddress: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA",
    },
    paymentMethod: "credit_card",
  },
];

describe("useOrders", () => {
  it("should obtain orders", async () => {
    mockGetOrders.mockResolvedValue(mockOrders);
    mockUseSession.mockReturnValue({ user: { id: 1 } });

    const { result } = renderHook(() => useOrders());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.orders).toEqual(mockOrders);
      expect(result.current.error).toBeNull();
    });
  });

  it("should return error when obtain orders fail", async () => {
    mockGetOrders.mockRejectedValue("Error obtaining orders");

    const { result } = renderHook(() => useOrders());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.orders).toEqual([]);
      expect(result.current.error).toBe(
        "Failed to fetch orders. Please try again later"
      );
    });
  });
});
