package br.com.lacasa.sistemavendas.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class ProdutoResponseDTO {

	private Long id;
	private String nome;
	private BigDecimal preco;
	private Integer quantidade;
}
