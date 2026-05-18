import { type ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-brown-sugar/10 bg-tofu-white/80 p-5 shadow-lg shadow-brown-sugar/5 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}
