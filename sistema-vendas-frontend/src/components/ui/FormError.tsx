type FormErrorProps = {
  message?: string;
};

export function FormError({ message }: FormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p role="alert" className="mt-1 text-xs font-medium text-red-600">
      {message}
    </p>
  );
}
