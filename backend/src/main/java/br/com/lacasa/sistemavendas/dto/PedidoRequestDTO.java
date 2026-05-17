package br.com.lacasa.sistemavendas.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record PedidoRequestDTO(
		
		@NotNull(message = "O cliente é obrigatorio")
		Long clienteId,
		
		@NotEmpty(message = "O pedido precisa ter pelo menos um item")
		List<@Valid ItemPedidoRequestDTO> itens
		
		
) {

	
}
