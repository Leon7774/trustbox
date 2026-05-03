import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full p-8 flex flex-col items-center animate-in fade-in duration-700">
      {children}
    </div>
  );
}
