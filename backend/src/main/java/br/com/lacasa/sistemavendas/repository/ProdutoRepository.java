package br.com.lacasa.sistemavendas.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import br.com.lacasa.sistemavendas.entity.Produto;

public interface ProdutoRepository  extends JpaRepository<Produto, Long>{

	boolean existsBynomeIgnoreCase(String nome);
	
	Page<Produto> findByNomeContainingIgnoreCase(
			String nome,
			Pageable pageable
			
			);
}
