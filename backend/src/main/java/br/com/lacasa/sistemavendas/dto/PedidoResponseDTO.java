package br.com.lacasa.sistemavendas.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import br.com.lacasa.sistemavendas.entity.StatusPedido;

public record PedidoResponseDTO(
		
		Long id,
		Long clienetId,
		String nomeCliente,
		LocalDateTime dataPedido,
		StatusPedido status,
		LocalDateTime dataCriacao,
		BigDecimal valorTotal,
		List<ItemPedidoResponseDTO>itens

		
		
		) {
	

}
