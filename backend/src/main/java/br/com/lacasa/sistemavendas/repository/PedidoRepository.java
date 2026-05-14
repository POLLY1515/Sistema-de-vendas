package br.com.lacasa.sistemavendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.lacasa.sistemavendas.entity.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

}
