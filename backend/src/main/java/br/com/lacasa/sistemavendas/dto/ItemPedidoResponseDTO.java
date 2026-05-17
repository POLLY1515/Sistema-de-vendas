package br.com.lacasa.sistemavendas.dto;

import java.math.BigDecimal;

public record ItemPedidoResponseDTO(
		
		Long produtoId,
		String nomeProduto,
		Integer quantidade,
		BigDecimal precoUnitario,
		BigDecimal subTotal
		
		
		) {

}
