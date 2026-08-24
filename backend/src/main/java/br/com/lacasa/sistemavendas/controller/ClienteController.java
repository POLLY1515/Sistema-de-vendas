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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
@Tag(name = "Clientes", description = "Operações relacionadas ao gerenciamento de clientes")
public class ClienteController {

	private static final Set<String> CAMPOS_ORDENACAO = Set.of("id", "nome", "email");

	private final ClienteService clienteService;

	@Operation(summary = "Cadastrar cliente", description = "Realiza o cadastro de um novo cliente no sistema.")
	@ApiResponses({ @ApiResponse(responseCode = "201", description = "Cliente cadastrado com sucesso"),
			@ApiResponse(responseCode = "400", description = "Dados inválidos enviados na requisição"),
			@ApiResponse(responseCode = "404", description = "Cliente não encontrado") })

	@PostMapping
	public ResponseEntity<ClienteResponseDTO> cadastrar(@Valid @RequestBody ClienteRequestDTO request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.cadastrar(request));
	}

	@Operation(summary = "Listar clientes", description = "Retorna todos os clientes cadastrados no sistema.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Clientes encontrados com sucesso") })
	@GetMapping
	public ResponseEntity<List<ClienteResponseDTO>> listar() {
		return ResponseEntity.ok(clienteService.listarTodos());
	}

	@Operation(summary = "Buscar cliente por ID", description = "Retorna um cliente específico através do seu identificador.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Cliente encontrado com sucesso"),
			@ApiResponse(responseCode = "404", description = "Cliente não encontrado") })
	@GetMapping("/{id}")
	public ResponseEntity<ClienteResponseDTO> buscarPorId(
			@Parameter(description = "ID do cliente", example = "1") @PathVariable Long id) {
		return ResponseEntity.ok(clienteService.buscarPorId(id));
	}

	@Operation(summary = "Buscar clientes", description = "Realiza uma busca paginada de clientes utilizando um termo de pesquisa.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Clientes encontrados com sucesso"),
			@ApiResponse(responseCode = "400", description = "Parâmetros de busca inválidos") })
	@GetMapping("/buscar")
	public ResponseEntity<PaginaResponseDTO<ClienteResponseDTO>> buscarPorTermo(
			@Parameter(description = "Termo utilizado para buscar clientes", example = "João") @RequestParam String termo,

			@Parameter(description = "Número da página", example = "0") @RequestParam(defaultValue = "0") int pagina,

			@Parameter(description = "Quantidade de registros por página", example = "10") @RequestParam(defaultValue = "10") int tamanho,

			@Parameter(description = "Campo utilizado para ordenação", example = "nome") @RequestParam(defaultValue = "nome") String ordenarPor,

			@Parameter(description = "Direção da ordenação", example = "asc") @RequestParam(defaultValue = "asc") String direcao) {
		Pageable pageable = criarPageable(pagina, tamanho, ordenarPor, direcao);
		return ResponseEntity.ok(clienteService.buscarPorTermo(termo, pageable));
	}

	@Operation(summary = "Atualizar cliente", description = "Atualiza os dados de um cliente existente no sistema.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Cliente atualizado com sucesso"),
			@ApiResponse(responseCode = "400", description = "Dados inválidos enviados na requisição"),
			@ApiResponse(responseCode = "404", description = "Cliente não encontrado") })
	@PutMapping("/{id}")
	public ResponseEntity<ClienteResponseDTO> atualizar(
			@Parameter(description = "ID do cliente", example = "1") @PathVariable Long id,
			@Valid @RequestBody ClienteRequestDTO request) {
		return ResponseEntity.ok(clienteService.atualizar(id, request));
	}

	@Operation(summary = "Excluir cliente", description = "Remove um cliente existente do sistema.")
	@ApiResponses({ @ApiResponse(responseCode = "204", description = "Cliente excluído com sucesso"),
			@ApiResponse(responseCode = "404", description = "Cliente não encontrado") })
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(
			@Parameter(description = "ID do cliente", example = "1") @PathVariable Long id) {
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
		Sort sort = direcao.equalsIgnoreCase("desc") ? Sort.by(ordenarPor).descending()
				: Sort.by(ordenarPor).ascending();

		return PageRequest.of(pagina, tamanhoLimitado, sort);
	}
}
