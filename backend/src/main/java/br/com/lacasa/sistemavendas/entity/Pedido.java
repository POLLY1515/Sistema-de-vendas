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
import jakarta.persistence.Table;

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
	
	
	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal valorTotal = BigDecimal.ZERO;
	


	public Long getId() {
		return id;
	}



	public void setId(Long id) {
		this.id = id;
	}



	public Cliente getCliente() {
		return cliente;
	}



	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}



	public List<ItemPedido> getItens() {
		return itens;
	}



	public void setItens(List<ItemPedido> itens) {
		this.itens = itens;
	}



	public LocalDateTime getDataPedido() {
		return dataPedido;
	}



	public void setDataPedido(LocalDateTime dataPedido) {
		this.dataPedido = dataPedido;
	}



	public StatusPedido getStatus() {
		return status;
	}



	public void setStatus(StatusPedido status) {
		this.status = status;
	}



	public BigDecimal getValorTotal() {
		return valorTotal;
	}



	public void setValorTotal(BigDecimal valorTotal) {
		this.valorTotal = valorTotal;
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
