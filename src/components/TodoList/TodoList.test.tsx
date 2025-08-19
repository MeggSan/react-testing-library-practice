import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { TodoList } from "./TodoList";
import userEvent from "@testing-library/user-event";

describe("<TodoList />", () => {
  beforeEach(() => {
    render(<TodoList />);
  });

  it("should render input to enter Todo task", () => {
    const input = screen.getByPlaceholderText("Enter Todo task");
    expect(input).toBeInTheDocument();
  });

  it("should render button to add Todo task", () => {
    const button = screen.getByRole("button", { name: /add todo task/i });
    expect(button).toBeInTheDocument();
  });

  it("should render empty list", () => {
    const todoTasks = screen.queryAllByRole("listitem");
    expect(todoTasks).toHaveLength(0);
  });

  it("should render added Todo task", async () => {
    const todoTask = "Do laundry";
    const input = screen.getByPlaceholderText("Enter Todo task");
    const button = screen.getByRole("button", { name: /add todo task/i });

    await userEvent.type(input, todoTask);
    await userEvent.click(button);

    const todoTasks = screen.queryAllByRole("listitem");
    expect(todoTasks).toHaveLength(1);
    expect(todoTasks[0]).toHaveTextContent(todoTask);
  });

  it("removes a todo task when clicking remove", async () => {
    const todoTask = "Fold clothes";
    const input = screen.getByPlaceholderText("Enter Todo task");
    const button = screen.getByRole("button", { name: /add todo task/i });

    await userEvent.type(input, todoTask);
    await userEvent.click(button);

    const todoTasks = screen.queryAllByRole("listitem");
    expect(todoTasks).toHaveLength(1);

    const removeButton = screen.getByText("Remove Todo task");

    await userEvent.click(removeButton);

    const todoTasksAfterDelete = screen.queryAllByRole("listitem");
    expect(todoTasksAfterDelete).toHaveLength(0);
  });

  it("does not add empty todo task", async () => {
    const button = screen.getByRole("button", { name: /add todo task/i });
    await userEvent.click(button);

    const todoTasks = screen.queryAllByRole("listitem");
    expect(todoTasks).toHaveLength(0);
  });

  it("clears input after adding a task", async () => {
    const todoTask = "Clean the kitchen table";

    const input = screen.getByPlaceholderText("Enter Todo task");
    const button = screen.getByRole("button", { name: /add todo task/i });

    await userEvent.type(input, todoTask);
    await userEvent.click(button);

    expect(input).toHaveValue("");
  });
});
