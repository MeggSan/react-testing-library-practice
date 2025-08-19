import { useState } from "react";
import { Button } from "../Button";

export const TodoList = () => {
  const [todoTaskValue, setTodoTaskValue] = useState("");
  const [todoList, setTodoList] = useState<string[]>([]);

  const addTaskTodoList = () => {
    if (todoTaskValue.length > 0) {
      setTodoList((prev) => [...prev, todoTaskValue]);
      setTodoTaskValue("");
    }
  };

  const onChangeTodoTaskValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTaskValue(e.target.value);
  };

  const removeTaskTodoList = (todoTask: string) => {
    setTodoList((prev) => prev.filter((todo) => todo !== todoTask));
  };

  return (
    <>
      <input
        placeholder="Enter Todo task"
        value={todoTaskValue}
        onChange={onChangeTodoTaskValue}
      />
      <Button label="Add Todo task" onClick={addTaskTodoList} />
      <ul>
        {todoList.length === 0 && <p>Todo List is empty</p>}
        {todoList.map((todo) => {
          return (
            <li key={crypto.randomUUID()}>
              <p>{todo}</p>
              <Button
                label="Remove Todo task"
                onClick={() => removeTaskTodoList(todo)}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
};
