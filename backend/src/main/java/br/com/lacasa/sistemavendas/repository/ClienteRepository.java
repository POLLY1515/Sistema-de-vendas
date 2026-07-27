package br.com.lacasa.sistemavendas.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import br.com.lacasa.sistemavendas.entity.Cliente;

public interface ClienteRepository  extends JpaRepository<Cliente, Long>{

	boolean existsByCpf(String cpf);
	
	boolean existsByEmailIgnoreCase(String email);
	
	Page<Cliente> findByNomeContainingIgnoreCaseOrEmailContainingIgnoreCase(
		    String nome,
		    String email,
		    Pageable pageable
		);
}
