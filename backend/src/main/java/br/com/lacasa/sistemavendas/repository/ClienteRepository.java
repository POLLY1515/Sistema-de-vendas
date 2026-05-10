package br.com.lacasa.sistemavendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.lacasa.sistemavendas.entity.Cliente;

public interface ClienteRepository  extends JpaRepository<Cliente, Long>{

	boolean existsByEmail(String email);
	boolean existsByCpf(String cpf);
}
