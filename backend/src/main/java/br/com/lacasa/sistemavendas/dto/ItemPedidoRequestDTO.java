package br.com.lacasa.sistemavendas.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ItemPedidoRequestDTO(
		
		@NotNull(message = "O produto é obrigatorio")
		Long produtoId,
		
		@NotNull(message = "A quantidade é obrigatoria")
		@Min(value = 1, message = "A quantidade mínima é 1")
		Integer quantidade
	) {

}
