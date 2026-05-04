package br.com.lacasa.sistemavendas.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name= "produtos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Produto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@NotBlank(message="O nome do produto é obrigatorio")
	@Column(nullable = false, length = 100)
	private String nome;
	
	@NotNull(message = "O preço é obrigatorio")
	@Positive(message = "O preço deve ser maior que zero")
	@Column(nullable = false)
	private BigDecimal preco;
	
	@NotNull(message = "a quantidade é obrigatoria")
	@PositiveOrZero(message = "A quantidade não pode ser negativa")
	@Column(nullable = false)
	private Integer quantidade;
}
