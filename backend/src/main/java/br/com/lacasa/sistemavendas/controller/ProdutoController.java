package br.com.lacasa.sistemavendas.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.lacasa.sistemavendas.entity.Produto;
import br.com.lacasa.sistemavendas.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/produtos")
@RequiredArgsConstructor
public class ProdutoController {
	
	private final ProdutoService produtoService;

	@PostMapping
	public ResponseEntity<Produto> cadastrar(@Valid @RequestBody Produto produto){
		Produto produtoCadastrado = produtoService.cadastrar(produto);
		return ResponseEntity.status(HttpStatus.CREATED).body(produtoCadastrado);
	}
	
	@GetMapping
	public ResponseEntity<List<Produto>> listarTodos(){
		List<Produto> produtos = produtoService.listarTodos();
		return ResponseEntity.ok(produtos);
		
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Produto> buscarPorId(@PathVariable Long id){
		Produto produto = produtoService.buscarPorId(id);
		return ResponseEntity.ok(produto);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Produto> atualizar(
			@PathVariable Long id, 
			@Valid @RequestBody Produto produto){
		Produto produtoAtualizado = produtoService.atualizar(id, produto);
		return ResponseEntity.ok(produtoAtualizado);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id){
		produtoService.deletar(id);
		return ResponseEntity.noContent().build();		
	}
	
	
	
	
	
	
	
}
