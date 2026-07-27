package br.com.lacasa.sistemavendas.controller;

import java.util.List;
import java.util.Set;

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

import br.com.lacasa.sistemavendas.dto.ClienteRequestDTO;
import br.com.lacasa.sistemavendas.dto.ClienteResponseDTO;
import br.com.lacasa.sistemavendas.dto.PaginaResponseDTO;
import br.com.lacasa.sistemavendas.exception.RegraNegocioException;
import br.com.lacasa.sistemavendas.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private static final Set<String> CAMPOS_ORDENACAO = Set.of("id", "nome", "email");

    private final ClienteService clienteService;

    @PostMapping
    public ResponseEntity<ClienteResponseDTO> cadastrar(@Valid @RequestBody ClienteRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.cadastrar(request));
    }

    @GetMapping
    public ResponseEntity<List<ClienteResponseDTO>> listar() {
        return ResponseEntity.ok(clienteService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.buscarPorId(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<PaginaResponseDTO<ClienteResponseDTO>> buscarPorTermo(
            @RequestParam String termo,
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int tamanho,
            @RequestParam(defaultValue = "nome") String ordenarPor,
            @RequestParam(defaultValue = "asc") String direcao
    ) {
        Pageable pageable = criarPageable(pagina, tamanho, ordenarPor, direcao);
        return ResponseEntity.ok(clienteService.buscarPorTermo(termo, pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ClienteRequestDTO request
    ) {
        return ResponseEntity.ok(clienteService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        clienteService.remover(id);
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
            throw new RegraNegocioException("Campo de ordenação inválido para clientes.");
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
