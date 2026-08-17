import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import {
  Button,
  type ButtonVariant,
} from "./Button";

type LoadingButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    loading?: boolean;
    loadingText?: string;
    variant?: ButtonVariant;
  };

export function LoadingButton({
  children,
  loading = false,
  loadingText = "Processando...",
  disabled,
  variant = "primary",
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      variant={variant}
      disabled={disabled || loading}
    >
      {loading ? loadingText : children}
    </Button>
  );
}
