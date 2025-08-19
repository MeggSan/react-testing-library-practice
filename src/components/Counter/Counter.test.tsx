import { describe, it, expect } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "./Counter";

describe("<Counter />", () => {
  it("should show the initial value", () => {
    render(<Counter />);
    const count = screen.getByText("Count: 0");
    expect(count).toBeInTheDocument();
  });

  it("should increment the counter", async () => {
    render(<Counter />);
    const button = screen.getByText("Increment");
    await userEvent.click(button);
    // await act(() => {
    //   fireEvent.click(button);
    // });
    const count = screen.getByText("Count: 1");
    expect(count).toBeInTheDocument();
  });

  it("should decrement the counter", async () => {
    render(<Counter />);
    const button = screen.getByText("Decrement");
    await userEvent.click(button);
    // await act(() => {
    //   fireEvent.click(button);
    // });
    const count = screen.getByText("Count: -1");
    expect(count).toBeInTheDocument();
  });
});
