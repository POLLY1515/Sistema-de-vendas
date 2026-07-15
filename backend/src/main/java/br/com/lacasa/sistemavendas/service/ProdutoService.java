package br.com.lacasa.sistemavendas.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.lacasa.sistemavendas.dto.PaginaResponseDTO;
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
		return converterParaResponse(produtoSalvo);
		
	}
	
	

	public List<ProdutoResponseDTO> listarTodos(){
		return produtoRepository.findAll()
				.stream()
				.map(this:: converterParaResponse)
				.toList();
	}
	
	public PaginaResponseDTO<ProdutoResponseDTO> listarPaginado(Pageable pageable){
		//Pageable vai guardar o numero da pagina, tamanho e ordenaçao se tiver
		Page<Produto> pagina = produtoRepository.findAll(pageable);
		
		Page<ProdutoResponseDTO> paginaDTO = pagina.map(this::converterParaResponse);
		
		return montarPaginaResponse(paginaDTO);
	}
	
	
	public PaginaResponseDTO<ProdutoResponseDTO> buscarPorNome(String nome, Pageable pageable){
		
		Page<Produto> pagina = produtoRepository.findByNomeContainingIgnoreCase(nome, pageable);
		
		Page<ProdutoResponseDTO> paginaDTO = pagina.map(this::converterParaResponse);
		
		return montarPaginaResponse(paginaDTO);
	}
	
	public ProdutoResponseDTO buscarPorId(Long id) {
		Produto produto = buscarEntidadePorId(id);
		return converterParaResponse(produto);
						
	}
	
	public ProdutoResponseDTO atualizar(Long id, ProdutoRequestDTO dto) {
		Produto  produtoExistente = buscarEntidadePorId(id);
		
		
		produtoExistente.setNome(dto.getNome());
		produtoExistente.setPreco(dto.getPreco());
		produtoExistente.setQuantidadeEstoque(dto.getQuantidadeEstoque());
		
		Produto produtoAtualizado = produtoRepository.save(produtoExistente);
		return converterParaResponse(produtoAtualizado);
		
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
	
	private PaginaResponseDTO<ProdutoResponseDTO> montarPaginaResponse(Page<ProdutoResponseDTO> pagina){
		
		return new PaginaResponseDTO<>(
				pagina.getContent(),
				pagina.getNumber(),
				pagina.getSize(),
				pagina.getTotalElements(),
				pagina.getTotalPages(),
				pagina.isFirst(),
				pagina.isLast()
				
				);
				
	}
	
	private ProdutoResponseDTO converterParaResponse(Produto produto) {
		return new ProdutoResponseDTO(
				produto.getId(),
				produto.getNome(),
				produto.getPreco(),
				produto.getQuantidadeEstoque()
				
				);
	}
}
