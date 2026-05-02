"use client";

import { Button } from "@/components/ui/button";
import { CountTokensResponse } from "@google/genai";
import { useReducer, useState } from "react";
import DisplayCounter from "./_components/Counter";

type Counter = {
  count: number;
};

function reducer(state: Counter, action) {
  return { count: state.count + 1 };
}

export default function ComponentName() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  const [count, setCount] = useState(0);

  return (
    <div className="flex w-full min-h-100 gap-2 items-center justify-center">
      <Button onClick={() => setCount((count) => count + 1)}>+</Button>
      <DisplayCounter count={count} />
      <Button onClick={() => setCount((count) => count - 1)}>-</Button>
    </div>
  );
}
