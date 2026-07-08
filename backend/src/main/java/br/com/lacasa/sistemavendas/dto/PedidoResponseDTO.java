package br.com.lacasa.sistemavendas.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import br.com.lacasa.sistemavendas.entity.Pedido;
import br.com.lacasa.sistemavendas.entity.StatusPedido;

public record PedidoResponseDTO(

        Long id,
        Long clienteId,
        String nomeCliente,
        LocalDateTime dataPedido,
        StatusPedido status,
        LocalDateTime dataCriacao,
        BigDecimal valorTotal,
        List<ItemPedidoResponseDTO> itens

) {

    public PedidoResponseDTO(Pedido pedido) {
        this(
                pedido.getId(),
                pedido.getCliente().getId(),
                pedido.getCliente().getNome(),
                pedido.getDataPedido(),
                pedido.getStatus(),
                pedido.getDataCriacao(),
                pedido.getValorTotal(),
                pedido.getItens()
                        .stream()
                        .map(ItemPedidoResponseDTO::new)
                        .toList()
        );
    }
}