type ApiErrorObject = {
  mensagem?: unknown;
  message?: unknown;
  erro?: unknown;
};

export function obterMensagemErro(
  error: unknown,
  fallback = "Ocorreu um erro inesperado."
): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const objeto = error as ApiErrorObject;

    for (const valor of [
      objeto.mensagem,
      objeto.message,
      objeto.erro,
    ]) {
      if (typeof valor === "string" && valor.trim()) {
        return valor;
      }
    }
  }

  return fallback;
}
