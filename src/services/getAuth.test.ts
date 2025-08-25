import { describe, it, expect, vi } from "vitest";
import { getAuth } from "./getAuth";

describe("getAuth", () => {
  it("should return the first user when API returns data", async () => {
    const userEmail = "superadmin@example.com";
    const userPassword = "superadmin123!";
    const userId = "550e8400-e29b-41d4-a716-446655440000";

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue([
        {
          id: "550e8400-e29b-41d4-a716-446655440000",
          email: userEmail,
        },
      ]),
    });

    const result = await getAuth(userEmail, userPassword);
    expect(result).toEqual({ id: userId, email: userEmail });
  });

  it("should return an error when the user information is incorrect", async () => {
    const userEmail = "test@example.com";
    const userPassword = "testPassword";

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue([]),
    });

    await expect(getAuth(userEmail, userPassword)).rejects.toThrow(
      "Invalid username or password"
    );
  });

  it("should throw an error when fetch fails", async () => {
    const userEmail = "test@example.com";
    const userPassword = "testPassword";

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockRejectedValue(new Error("Network error")),
    });

    await expect(getAuth(userEmail, userPassword)).rejects.toHaveProperty(
      "message"
    );
  });
});
