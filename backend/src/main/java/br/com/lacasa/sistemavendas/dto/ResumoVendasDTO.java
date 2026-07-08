package br.com.lacasa.sistemavendas.dto;

import java.math.BigDecimal;

public record ResumoVendasDTO(
		
		Long quantidadePedidos,
		BigDecimal totalVendido
		
		) {

	
}
