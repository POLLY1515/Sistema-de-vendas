"use client";

import { useCallback, useState } from "react";
import { useFeedback } from "@/components/feedback/FeedbackProvider";
import { getErrorMessage } from "@/lib/getErrorMessage";

type AsyncActionOptions<T> = {
  successMessage?: string | ((data: T) => string);
  errorMessage?: string;
};

type AsyncActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: unknown };

export function useAsyncAction() {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useFeedback();

  const execute = useCallback(
    async <T,>(
      action: () => Promise<T>,
      options: AsyncActionOptions<T> = {}
    ): Promise<AsyncActionResult<T>> => {
      try {
        setLoading(true);

        const data = await action();

        if (options.successMessage) {
          const message =
            typeof options.successMessage === "function"
              ? options.successMessage(data)
              : options.successMessage;

          showSuccess(message);
        }

        return { ok: true, data };
      } catch (error) {
        showError(
          getErrorMessage(
            error,
            options.errorMessage ??
              "Não foi possível concluir a operação."
          )
        );

        return { ok: false, error };
      } finally {
        setLoading(false);
      }
    },
    [showError, showSuccess]
  );

  return { loading, execute };
}
