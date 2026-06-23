package br.com.lacasa.sistemavendas.entity;

import java.math.BigDecimal;

import br.com.lacasa.sistemavendas.exception.EstoqueInsuficienteException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
	
	@Column(nullable = false, length = 100)
	private String nome;
	
	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal preco;
	
	@Column(nullable = false)
	private Integer quantidadeEstoque = 0;
	
	
	
	
	public void baixarEstoque(Integer quantidadeVendida) {
		if(quantidadeVendida > this.quantidadeEstoque) {
			throw new EstoqueInsuficienteException("Estoque insuficiente para o produto" + this.nome);
		}
		this.quantidadeEstoque = this.quantidadeEstoque - quantidadeVendida;
	}
	
	
	public void devolverEstoque(Integer quantidadeDevolvida) {
		this.quantidadeEstoque = this.quantidadeEstoque + quantidadeDevolvida;
	}
	
	
	
	
	
}
