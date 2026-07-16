package br.com.lacasa.sistemavendas.controller;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.lacasa.sistemavendas.dto.PaginaResponseDTO;
import br.com.lacasa.sistemavendas.dto.ProdutoRequestDTO;
import br.com.lacasa.sistemavendas.dto.ProdutoResponseDTO;
import br.com.lacasa.sistemavendas.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/produtos")
@RequiredArgsConstructor
public class ProdutoController {

	private final ProdutoService produtoService;

	@PostMapping
	public ResponseEntity<ProdutoResponseDTO> cadastrar(@Valid @RequestBody ProdutoRequestDTO dto) {
		ProdutoResponseDTO produto = produtoService.cadastrar(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(produto);
	}

	@GetMapping
	public ResponseEntity<List<ProdutoResponseDTO>> listarTodos() {
		List<ProdutoResponseDTO> produtos = produtoService.listarTodos();
		return ResponseEntity.ok(produtos);

	}

	public ResponseEntity<PaginaResponseDTO<ProdutoResponseDTO>> listarPaginado(
			@RequestParam(defaultValue = "0") int pagina, @RequestParam(defaultValue = "10") int tamanho,
			@RequestParam(defaultValue = "nome") String ordenarPor, @RequestParam(defaultValue = "asc") String direcao

	) {

		Pageable pageable = criarPageable(pagina, tamanho, ordenarPor, direcao

		);

		return ResponseEntity.ok(produtoService.listarPaginado(pageable));

	}

	@GetMapping("/{id}")
	public ResponseEntity<ProdutoResponseDTO> buscarPorId(@PathVariable Long id) {
		ProdutoResponseDTO produto = produtoService.buscarPorId(id);
		return ResponseEntity.ok(produto);
	}

	
	@GetMapping("/buscar")
	public ResponseEntity<PaginaResponseDTO<ProdutoResponseDTO>> buscarPorNome(@RequestParam String nome,
			@RequestParam(defaultValue = "0") int pagina, @RequestParam(defaultValue = "10") int tamanho,
			@RequestParam(defaultValue = "nome") String ordenarPor, @RequestParam(defaultValue = "asc") String direcao

	) {

		Pageable pageable = criarPageable(pagina, tamanho, ordenarPor, direcao

		);

		return ResponseEntity.ok(produtoService.buscarPorNome(nome, pageable));

	}

	private Pageable criarPageable(int pagina, int tamanho, String ordenarPor, String direcao

	) {

		if (tamanho > 50) {
			tamanho = 50;
		}

		Sort sort = direcao.equalsIgnoreCase("desc") ? Sort.by(ordenarPor).descending()
				: Sort.by(ordenarPor).ascending();

		return PageRequest.of(pagina, tamanho, sort);
	}

	@PutMapping("/{id}")
	public ResponseEntity<ProdutoResponseDTO> atualizar(@PathVariable Long id,
			@Valid @RequestBody ProdutoRequestDTO dto) {
		ProdutoResponseDTO produto = produtoService.atualizar(id, dto);
		return ResponseEntity.ok(produto);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id) {
		produtoService.deletar(id);
		return ResponseEntity.noContent().build();
	}

}
