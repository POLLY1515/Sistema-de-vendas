package br.com.lacasa.sistemavendas.dto;

import java.util.List;

public record PaginaResponseDTO<T>(
		List<T> conteudo,//pode ser uma lista de clientes, produtos ou pedidos
		int paginaAtual,
		int tamanhoPagina,
		int totalElementos,
		int totalPaginas,
		boolean primeira,
		boolean ultima) {

}
