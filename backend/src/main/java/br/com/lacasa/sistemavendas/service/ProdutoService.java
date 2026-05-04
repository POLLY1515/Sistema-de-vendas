package br.com.lacasa.sistemavendas.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.lacasa.sistemavendas.entity.Produto;
import br.com.lacasa.sistemavendas.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProdutoService {
	
	private final ProdutoRepository produtoRepository;

	
	public Produto cadastrar(Produto produto) {
		return produtoRepository.save(produto);
	}
	
	public List<Produto> listarTodos(){
		return produtoRepository.findAll();
	}
	
	public Produto buscarPorId(Long id) {
		return produtoRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException( 
						HttpStatus.NOT_FOUND,
						"Produto não encontardo"
						));
	}
	
	public Produto atualizar(Long id, Produto produtoAtualizado) {
		Produto  produtoExixtente = buscarPorId(id);
		
		produtoExixtente.setNome(produtoAtualizado.getNome());
		produtoExixtente.setPreco(produtoAtualizado.getPreco());
		produtoExixtente.setQuantidade(produtoAtualizado.getQuantidade());
		
		return produtoRepository.save(produtoExixtente);
	}
	
	public void deletar(Long id) {
		Produto produto = buscarPorId(id);
		 produtoRepository.delete(produto);
	}
}
