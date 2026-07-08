package br.com.lacasa.sistemavendas.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "pedidos")
public class Pedido {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	//Muitos pedidos podem pertencer a um cliente.
	//O pedido não pode existir sem cliente.
	@ManyToOne(optional = false)		
	@JoinColumn(name = "cliente_id")
	private Cliente cliente;
								
	
	/*Diz que um pedido pode ter vários itens. O mappedBy indica que o dono da relação
	está no campo pedido dentro de ItemPedido.*/
	@OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ItemPedido> itens = new ArrayList<>();

	@Column(nullable = false)
	private LocalDateTime dataPedido = LocalDateTime.now();
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private StatusPedido status = StatusPedido.ABERTO;
	
	@Column(name = "data_criacao", nullable = false, updatable = false)
	private LocalDateTime dataCriacao;
	
	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal valorTotal = BigDecimal.ZERO;
	


	
	@PrePersist
	public void preencherDataCriacao() {
	    if (this.dataCriacao == null) {
	        this.dataCriacao = LocalDateTime.now();
	    }
	}


	public void adicionarItem(ItemPedido item) {
		item.setPedido(this);
		this.itens.add(item);
	}
	
	public void calcularValorTotal() {
	    this.valorTotal = itens.stream()              // percorre todos os itens
	            .map(ItemPedido::getSubtotal)        // pega o subtotal de cada item
	            .reduce(BigDecimal.ZERO, BigDecimal::add); // soma todos os subtotais
	}
	
	
}
