package br.com.lacasa.sistemavendas.dto;

import java.math.BigDecimal;

import br.com.lacasa.sistemavendas.entity.ItemPedido;

public record ItemPedidoResponseDTO(

        Long produtoId,
        String nomeProduto,
        Integer quantidade,
        BigDecimal precoUnitario,
        BigDecimal subTotal

) {

    public ItemPedidoResponseDTO(ItemPedido item) {
        this(
                item.getProduto().getId(),
                item.getProduto().getNome(),
                item.getQuantidade(),
                item.getPrecoUnitario(),
                item.getSubtotal()
        );
    }
}
