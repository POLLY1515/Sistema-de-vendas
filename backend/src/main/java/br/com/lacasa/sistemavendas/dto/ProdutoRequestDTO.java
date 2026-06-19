package br.com.lacasa.sistemavendas.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ProdutoRequestDTO {
	
	@NotBlank(message="O nome do produto é obrigatorio")
	@Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
	private String nome;
	
	@NotNull(message = "O preço é obrigatorio")
	@DecimalMin(value = "0.01", message = "O preço deve der maior que zero")
	private BigDecimal preco;
	
	
	@NotNull(message = "a quantidade em estoque é obrigatoria")
	@Min(value = 0, message = "A quantidade não pode ser negativa")
	private Integer quantidadeEstoque;
	
	

}
