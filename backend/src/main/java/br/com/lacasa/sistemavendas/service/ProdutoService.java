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
import br.com.lacasa.sistemavendas.exception.RegraNegocioException;
import br.com.lacasa.sistemavendas.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoResponseDTO cadastrar(ProdutoRequestDTO request) {
        validarNomeUnico(request.getNome(), null);

        Produto produto = new Produto();
        produto.setNome(request.getNome());
        produto.setPreco(request.getPreco());
        produto.setQuantidadeEstoque(request.getQuantidadeEstoque());

        return converterParaResponse(produtoRepository.save(produto));
    }

    public List<ProdutoResponseDTO> listarTodos() {
        return produtoRepository.findAll()
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    public PaginaResponseDTO<ProdutoResponseDTO> listarPaginado(Pageable pageable) {
        return montarPaginaResponse(produtoRepository.findAll(pageable).map(this::converterParaResponse));
    }

    public PaginaResponseDTO<ProdutoResponseDTO> buscarPorNome(String nome, Pageable pageable) {
        if (nome == null || nome.isBlank()) {
            throw new RegraNegocioException("Informe um nome para a busca de produtos.");
        }

        Page<ProdutoResponseDTO> pagina = produtoRepository
                .findByNomeContainingIgnoreCase(nome.trim(), pageable)
                .map(this::converterParaResponse);

        return montarPaginaResponse(pagina);
    }

    public ProdutoResponseDTO buscarPorId(Long id) {
        return converterParaResponse(buscarEntidadePorId(id));
    }

    public ProdutoResponseDTO atualizar(Long id, ProdutoRequestDTO dto) {
        Produto produtoExistente = buscarEntidadePorId(id);
        validarNomeUnico(dto.getNome(), id);

        produtoExistente.setNome(dto.getNome());
        produtoExistente.setPreco(dto.getPreco());
        produtoExistente.setQuantidadeEstoque(dto.getQuantidadeEstoque());

        return converterParaResponse(produtoRepository.save(produtoExistente));
    }

    public void deletar(Long id) {
        produtoRepository.delete(buscarEntidadePorId(id));
    }

    private Produto buscarEntidadePorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Produto com ID " + id + " não encontrado."
                ));
    }

    private void validarNomeUnico(String nome, Long idAtual) {
        boolean nomeJaCadastrado = idAtual == null
                ? produtoRepository.existsByNomeIgnoreCase(nome)
                : produtoRepository.existsByNomeIgnoreCaseAndIdNot(nome, idAtual);

        if (nomeJaCadastrado) {
            throw new RegraNegocioException("Já existe um produto cadastrado com este nome.");
        }
    }

    private PaginaResponseDTO<ProdutoResponseDTO> montarPaginaResponse(Page<ProdutoResponseDTO> pagina) {
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
