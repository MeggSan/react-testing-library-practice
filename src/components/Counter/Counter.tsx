import { useState } from "react";
import { Button } from "../Button";

export const Counter = () => {
  const [count, setCount] = useState(0);

  const incrementCounter = () => {
    setCount((prev) => prev + 1);
  };

  const decrementCounter = () => {
    setCount((prev) => prev - 1);
  };

  return (
    <>
      <p>Count: {count}</p>
      <Button label="Increment" onClick={incrementCounter} />
      <Button label="Decrement" onClick={decrementCounter} />
    </>
  );
};
