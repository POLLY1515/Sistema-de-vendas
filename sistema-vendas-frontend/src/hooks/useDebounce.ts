"use client";

import { useEffect, useState } from "react";

export function useDebounce<T>(
  valor: T,
  delay = 500
): T {
  const [valorDebounced, setValorDebounced] =
    useState(valor);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setValorDebounced(valor);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [valor, delay]);

  return valorDebounced;
}
