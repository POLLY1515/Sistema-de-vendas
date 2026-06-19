package br.com.lacasa.sistemavendas.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.lacasa.sistemavendas.dto.ProdutoRequestDTO;
import br.com.lacasa.sistemavendas.dto.ProdutoResponseDTO;
import br.com.lacasa.sistemavendas.entity.Produto;
import br.com.lacasa.sistemavendas.exception.RecursoNaoEncontradoException;
import br.com.lacasa.sistemavendas.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProdutoService {
	
	private final ProdutoRepository produtoRepository;

	
	public ProdutoResponseDTO cadastrar(ProdutoRequestDTO request) {
		Produto	produto = new Produto();
		
		produto.setNome(request.getNome());
		produto.setPreco(request.getPreco());
		produto.setQuantidadeEstoque(request.getQuantidadeEstoque());
		
		Produto produtoSalvo = produtoRepository.save(produto);
		return converterParaResponseDTO(produtoSalvo);
		
	}
	
	

	public List<ProdutoResponseDTO> listarTodos(){
		return produtoRepository.findAll()
				.stream()
				.map(this:: converterParaResponseDTO)
				.toList();
	}
	
	public ProdutoResponseDTO buscarPorId(Long id) {
		Produto produto = buscarEntidadePorId(id);
		return converterParaResponseDTO(produto);
						
	}
	
	public ProdutoResponseDTO atualizar(Long id, ProdutoRequestDTO dto) {
		Produto  produtoExistente = buscarEntidadePorId(id);
		
		
		produtoExistente.setNome(dto.getNome());
		produtoExistente.setPreco(dto.getPreco());
		produtoExistente.setQuantidade(dto.getQuantidadeEstoque());
		
		Produto produtoAtualizado = produtoRepository.save(produtoExistente);
		return converterParaResponseDTO(produtoAtualizado);
		
	}
	
	public void deletar(Long id) {
		Produto produto = buscarEntidadePorId(id);
		 produtoRepository.delete(produto);
	}
	
	
	private Produto buscarEntidadePorId(Long id) {
		return produtoRepository.findById(id)
				.orElseThrow(() -> new RecursoNaoEncontradoException(
						"Produto com ID" + id + " não encontrado"));
		
	}
	
	private ProdutoResponseDTO converterParaResponseDTO(Produto produto) {
		return new ProdutoResponseDTO(
				produto.getId(),
				produto.getNome(),
				produto.getPreco(),
				produto.getQuantidadeEstoque()
				
				);
	}
}
