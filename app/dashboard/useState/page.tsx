"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ComponentName() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex w-full min-h-100 gap-2 items-center justify-center">
      <Button onClick={() => setCount((count) => count + 1)}>+</Button>
      <h1>{count}</h1>
      <Button onClick={() => setCount((count) => count - 1)}>-</Button>
    </div>
  );
}
