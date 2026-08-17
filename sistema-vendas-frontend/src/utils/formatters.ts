export function formatarMoeda(
  valor: number
): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(valor ?? 0));
}

export function formatarData(
  dataIso: string
): string {
  if (!dataIso) {
    return "-";
  }

  const data = new Date(dataIso);

  if (Number.isNaN(data.getTime())) {
    return dataIso;
  }

  return data.toLocaleDateString("pt-BR");
}

export function formatarDataHora(
  dataIso: string
): string {
  if (!dataIso) {
    return "-";
  }

  const data = new Date(dataIso);

  if (Number.isNaN(data.getTime())) {
    return dataIso;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(data);
}

export function formatarQuantidade(
  valor: number
): string {
  return new Intl.NumberFormat(
    "pt-BR"
  ).format(Number(valor ?? 0));
}

export function limitarTexto(
  texto: string,
  tamanho = 40
): string {
  if (!texto) {
    return "-";
  }

  if (texto.length <= tamanho) {
    return texto;
  }

  return `${texto.slice(0, tamanho)}...`;
}
