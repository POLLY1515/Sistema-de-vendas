"use client";

import { useRef } from "react";

type RenderCounterProps = {
  label: string;
};

export function RenderCounter({
  label,
}: RenderCounterProps) {
  const renders = useRef(0);
  renders.current += 1;

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <span className="inline-flex rounded-full bg-violet-50 px-2 py-1 text-[10px] font-medium text-violet-700">
      {label}: {renders.current} render(es)
    </span>
  );
}
