package br.com.lacasa.sistemavendas.repository;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import br.com.lacasa.sistemavendas.entity.Pedido;
import br.com.lacasa.sistemavendas.entity.StatusPedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    Page<Pedido> findByStatus(
            StatusPedido status,
            Pageable pageable
    );

    Page<Pedido> findByClienteId(
            Long clienteId,
            Pageable pageable
    );

    Page<Pedido> findByDataCriacaoBetween(
            LocalDateTime inicio,
            LocalDateTime fim,
            Pageable pageable
    );

    Page<Pedido> findByStatusAndDataCriacaoBetween(
            StatusPedido status,
            LocalDateTime inicio,
            LocalDateTime fim,
            Pageable pageable
    );
}