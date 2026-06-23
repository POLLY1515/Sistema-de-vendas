package br.com.lacasa.sistemavendas.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.lacasa.sistemavendas.entity.Pedido;
import br.com.lacasa.sistemavendas.entity.StatusPedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

	List<Pedido> findByStatus(StatusPedido status);
	
	List<Pedido> findByClienteId(Long clienteId);
	
	List<Pedido> findByDataCriacaoBetween(
			LocalDateTime inicio,
			LocalDateTime fim
			);
	
	List<Pedido> findByStatusAndDataCriacaoBetween(
				StatusPedido status,
				LocalDateTime inicio,
				LocalDateTime fim
				);
}
//pagina 142