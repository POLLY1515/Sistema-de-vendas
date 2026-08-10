package br.com.lacasa.sistemavendas.controller;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import br.com.lacasa.sistemavendas.exception.RegraNegocioException;
import br.com.lacasa.sistemavendas.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private static final Set<String> CAMPOS_ORDENACAO = Set.of(
            "id", "nome", "preco", "quantidadeEstoque"
    );

    private final ProdutoService produtoService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProdutoResponseDTO> cadastrar(@Valid @RequestBody ProdutoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(produtoService.cadastrar(dto));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<List<ProdutoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(produtoService.listarTodos());
    }

    @GetMapping("/paginado")
    public ResponseEntity<PaginaResponseDTO<ProdutoResponseDTO>> listarPaginado(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanho,
            @RequestParam(defaultValue = "nome") String ordenarPor,
            @RequestParam(defaultValue = "asc") String direcao
    ) {
        Pageable pageable = criarPageable(pagina, tamanho, ordenarPor, direcao);
        return ResponseEntity.ok(produtoService.listarPaginado(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.buscarPorId(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<PaginaResponseDTO<ProdutoResponseDTO>> buscarPorNome(
            @RequestParam String nome,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanho,
            @RequestParam(defaultValue = "nome") String ordenarPor,
            @RequestParam(defaultValue = "asc") String direcao
    ) {
        Pageable pageable = criarPageable(pagina, tamanho, ordenarPor, direcao);
        return ResponseEntity.ok(produtoService.buscarPorNome(nome, pageable));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProdutoResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProdutoRequestDTO dto
    ) {
        return ResponseEntity.ok(produtoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        produtoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    private Pageable criarPageable(int pagina, int tamanho, String ordenarPor, String direcao) {
        if (pagina < 0) {
            throw new RegraNegocioException("O número da página não pode ser negativo.");
        }
        if (tamanho < 1) {
            throw new RegraNegocioException("O tamanho da página deve ser maior que zero.");
        }
        if (!CAMPOS_ORDENACAO.contains(ordenarPor)) {
            throw new RegraNegocioException("Campo de ordenação inválido para produtos.");
        }
        if (!direcao.equalsIgnoreCase("asc") && !direcao.equalsIgnoreCase("desc")) {
            throw new RegraNegocioException("A direção deve ser 'asc' ou 'desc'.");
        }

        int tamanhoLimitado = Math.min(tamanho, 50);
        Sort sort = direcao.equalsIgnoreCase("desc")
                ? Sort.by(ordenarPor).descending()
                : Sort.by(ordenarPor).ascending();

        return PageRequest.of(pagina, tamanhoLimitado, sort);
    }
}
