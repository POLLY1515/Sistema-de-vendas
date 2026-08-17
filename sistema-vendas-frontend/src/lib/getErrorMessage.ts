import { obterMensagemErro } from "./apiError";

export function getErrorMessage(
  error: unknown,
  fallback = "Não foi possível concluir a operação. Tente novamente."
): string {
  return obterMensagemErro(error, fallback);
}
