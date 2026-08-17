export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor || 0);
}

export function formatarData(dataIso: string): string {
  if (!dataIso) {
    return '-';
  }

  return new Date(dataIso).toLocaleDateString('pt-BR');
}

export function formatarQuantidade(valor: number): string {
  return new Intl.NumberFormat('pt-BR').format(valor || 0);
}

export function limitarTexto(texto: string, tamanho = 40): string {
  if (!texto) {
    return '-';
  }

  if (texto.length <= tamanho) {
    return texto;
  }

  return `${texto.slice(0, tamanho)}...`;
}
