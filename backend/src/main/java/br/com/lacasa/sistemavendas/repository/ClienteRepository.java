package br.com.lacasa.sistemavendas.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import br.com.lacasa.sistemavendas.entity.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    boolean existsByEmailIgnoreCase(String email);
    boolean existsByTelefone(String telefone);

    boolean existsByEmailIgnoreCaseAndIdNot(
            String email,
            Long id
    );

    boolean existsByCpf(String cpf);

    boolean existsByCpfAndIdNot(
            String cpf,
            Long id
    );

    Page<Cliente> findByNomeContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String nome,
            String email,
            Pageable pageable
    );
}