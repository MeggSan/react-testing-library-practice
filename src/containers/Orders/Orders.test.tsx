import { describe, it, expect, vi, Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Orders } from "./Orders";
import { SessionProvider, useSession } from "../../context/AuthContext";
import { MemoryRouter } from "react-router-dom";
import { getOrders } from "../../services/getOrders";
import { getSummaryOrders } from "../../utils/summary";

vi.mock("../../services/getOrders.ts", () => ({
  getOrders: vi.fn(),
}));

vi.mock("../../context/AuthContext", async () => {
  const actual = await vi.importActual("../../context/AuthContext");
  return {
    ...actual,
    useSession: vi.fn(),
  };
});

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

const mockGetOrders = getOrders as Mock;
const mockUseSession = useSession as Mock;

describe("<Orders />", () => {
  const handleRenderOrders = (userRole: string) => {
    const mockUser = userRole ? { role: userRole } : null;
    // (useSession as Mock).mockReturnValue({ user: mockUser });
    mockUseSession.mockReturnValue({ user: mockUser });
    render(
      <SessionProvider>
        <MemoryRouter>
          <Orders />
        </MemoryRouter>
      </SessionProvider>
    );
  };

  it("should show orders", async () => {
    mockGetOrders.mockResolvedValue(mockOrders);
    handleRenderOrders("visualizer");

    await waitFor(() => {
      const orders = screen.getAllByRole("heading", { level: 3 });
      expect(orders).toHaveLength(1);
    });
  });

  it("should render information section for superadmin users", async () => {
    mockGetOrders.mockResolvedValue(mockOrders);
    handleRenderOrders("superadmin");

    await waitFor(() => {
      const { totalOrders, totalValue, averageOrderValue } =
        getSummaryOrders(mockOrders);
      const totalOrdersElement = screen.getByTestId("totalOrders").textContent;
      const totalValueElement = screen.getByTestId("totalValue").textContent;
      const averageOrderValueElement =
        screen.getByTestId("averageOrderValue").textContent;
      expect(totalOrdersElement).length(totalOrders);
      expect(totalValueElement).toBe(`$${totalValue}`);
      expect(averageOrderValueElement).toBe(`$${averageOrderValue}`);
    });
  });
});
