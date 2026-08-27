package br.com.lacasa.sistemavendas.controller;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.lacasa.sistemavendas.dto.PedidoRequestDTO;
import br.com.lacasa.sistemavendas.dto.PedidoResponseDTO;
import br.com.lacasa.sistemavendas.dto.ResumoVendasDTO;
import br.com.lacasa.sistemavendas.entity.StatusPedido;
import br.com.lacasa.sistemavendas.service.PedidoService;
import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/pedidos")
@Tag(name = "Pedidos", description = "Operações relacionadas ao gerenciamento de pedidos e vendas")
public class PedidoController {

	private final PedidoService pedidoService;

	public PedidoController(PedidoService pedidoService) {
		this.pedidoService = pedidoService;
	}

	@Operation(summary = "Criar pedido", description = "Realiza a criação de um novo pedido de venda.")
	@ApiResponses({ @ApiResponse(responseCode = "201", description = "Pedido criado com sucesso"),
			@ApiResponse(responseCode = "400", description = "Dados inválidos ou regra de negocio violada"),
			@ApiResponse(responseCode = "401", description = "Usuário não autenticado"),
			@ApiResponse(responseCode = "403", description = "Usuário sem permissão para criar pedidos"),
			@ApiResponse(responseCode = "404", description = "Cliente ou produto não encontrado"),

	})
	@PostMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
	public ResponseEntity<PedidoResponseDTO> criar(@RequestBody @Valid PedidoRequestDTO request) {

		PedidoResponseDTO response = pedidoService.criarPedido(request);

		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@Operation(summary = "Buscar pedido por ID", description = "Retorna um pedido específico através do seu identificador.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Pedido encontrado com sucesso"),
			@ApiResponse(responseCode = "404", description = "Pedido não encontrado"),
			@ApiResponse(responseCode = "401", description = "Usuário não autenticado") })
	@GetMapping("/{id}")
	public ResponseEntity<PedidoResponseDTO> buscarPorId(
			@Parameter(description = "ID do pedido", example = "1") @PathVariable Long id) {

		return ResponseEntity.ok(pedidoService.buscarPorId(id));
	}

	@Operation(summary = "Listar pedidos", description = "Retorna uma lista paginada de pedidos cadastrados no sistema.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Pedidos encontrados com sucesso"),
			@ApiResponse(responseCode = "401", description = "Usuário não autenticado"),
			@ApiResponse(responseCode = "403", description = "Usuário sem permissão") })
	@GetMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
	public ResponseEntity<Page<PedidoResponseDTO>> listarTodos(
			@Parameter(description = "Parâmetros de paginação e ordenação") @PageableDefault(size = 10, sort = "dataCriacao", direction = Sort.Direction.DESC) Pageable pageable) {

		return ResponseEntity.ok(pedidoService.listarTodos(pageable));
	}

	@Operation(summary = "Listar pedidos por status", description = "Retorna pedidos filtrados pelo status informado.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Pedidos encontrados com sucesso"),
			@ApiResponse(responseCode = "400", description = "Status informado inválido"),
			@ApiResponse(responseCode = "401", description = "Usuario não autenticado") })
	@GetMapping("/status/{status}")
	public ResponseEntity<Page<PedidoResponseDTO>> listarPorStatus(
			@Parameter(description = "Status do pedido", example = "FINALIZADO") @PathVariable StatusPedido status,
			@PageableDefault(size = 10, sort = "dataCriacao", direction = Sort.Direction.DESC) Pageable pageable) {

		return ResponseEntity.ok(pedidoService.listarPorStatus(status, pageable));
	}

	@Operation(summary = "Listar pedidos por cliente", description = "Retorna todos os pedidos associados a um cliente específico.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Pedidos encontrados com sucesso"),
			@ApiResponse(responseCode = "401", description = "Usuário não autenticado"),
			@ApiResponse(responseCode = "404", description = "Cliente não encontrado ") })
	@GetMapping("/cliente/{clienteId}")
	public ResponseEntity<Page<PedidoResponseDTO>> listarPorCliente(
			@Parameter(description = "ID do cliente", example = "1") @PathVariable Long clienteId,
			@PageableDefault(size = 10, sort = "dataCriacao", direction = Sort.Direction.DESC) Pageable pageable) {

		return ResponseEntity.ok(pedidoService.listarPorCliente(clienteId, pageable));
	}

	@Operation(summary = "Listar pedidos por período", description = "Retorna pedidos criados dentro de um intervalo de datas informado.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Pedidos encontrados com sucesso"),
			@ApiResponse(responseCode = "400", description = "Datas informadas inválidas"),
			@ApiResponse(responseCode = "401", description = "Usuário não autenticado") })
	@GetMapping("/periodo")
	public ResponseEntity<Page<PedidoResponseDTO>> listarPorPeriodo(
			@Parameter(description = "Data inicial do período de busca", example = "2026-08-01T00:00:00")

			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,

			@Parameter(description = "Data final do período de busca", example = "2026-08-31T23:59:59") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim,

			@Parameter(description = "Parâmetros de paginação e ordenação") @PageableDefault(size = 10, sort = "dataCriacao", direction = Sort.Direction.DESC) Pageable pageable) {

		return ResponseEntity.ok(pedidoService.listarPorPeriodo(inicio, fim, pageable));
	}

	@Operation(summary = "Filtrar pedidos por status e período", description = "Retorna pedidos filtrados por status e período informado.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Relatório gerado com sucesso"),
			@ApiResponse(responseCode = "400", description = "Parâmetros informados inválidos"),
			@ApiResponse(responseCode = "401", description = "Usuário não autenticado") })
	@GetMapping("/relatorio")
	public ResponseEntity<Page<PedidoResponseDTO>> listarPorStatusEPeriodo(

			@Parameter(description = "Status dos pedidos no relatório", example = "FINALIZADO") @RequestParam StatusPedido status,

			@Parameter(description = "Data inicial do relatório", example = "2026-08-01T00:00:00") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,

			@Parameter(description = "Data final do relatório", example = "2026-08-31T23:59:59") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim,

			@Parameter(description = "Parâmetros de paginação e ordenação") @PageableDefault(size = 10, sort = "dataCriacao", direction = Sort.Direction.DESC) Pageable pageable) {

		return ResponseEntity.ok(pedidoService.listarPorStatusEPeriodo(status, inicio, fim, pageable));
	}

	@Operation(summary = "Gerar resumo de vendas", description = "Retorna um resumo das vendas finalizadas no sistema.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Resumo de vendas gerado com sucesso"),
			@ApiResponse(responseCode = "401", description = "Usuário não autenticado"),
			@ApiResponse(responseCode = "403", description = "Usuário sem permissão para acessar o resumo") })
	@GetMapping("/resumo")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ResumoVendasDTO> resumoVendas() {

		ResumoVendasDTO resumo = pedidoService.gerarResumoDeVendasFinalizadas();

		return ResponseEntity.ok(resumo);
	}

	@Operation(summary = "Cancelar pedido", description = "Realiza o cancelamento de um pedido existente.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Pedido cancelado com sucesso"),
			@ApiResponse(responseCode = "400", description = "Pedido não pode ser cancelado devido ao seu estado atual"),
			@ApiResponse(responseCode = "401", description = "Usuário não autenticado"),
			@ApiResponse(responseCode = "403", description = "Usuário sem permissão para cancelar pedidos"),
			@ApiResponse(responseCode = "404", description = "Pedido não encontrado") })
	@PatchMapping("/{id}/cancelar")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<PedidoResponseDTO> cancelar(@PathVariable Long id) {

		PedidoResponseDTO response = pedidoService.cancelarPedido(id);

		return ResponseEntity.ok(response);
	}

	@Operation(summary = "Finalizar pedido", description = "Realiza a finalização de um pedido existente.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Pedido finalizado com sucesso"),
			@ApiResponse(responseCode = "400", description = "Pedido não pode ser finalizado devido ao seu estado atual"),
			@ApiResponse(responseCode = "401", description = "Usuário não autenticado"),
			@ApiResponse(responseCode = "404", description = "Pedido não encontrado") })
	@PatchMapping("/{id}/finalizar")
	public ResponseEntity<PedidoResponseDTO> finalizar(@Parameter(
		    description = "ID do pedido",
		    example = "1"
		)
		@PathVariable Long id) {

		PedidoResponseDTO response = pedidoService.finalizarPedido(id);

		return ResponseEntity.ok(response);
	}
}