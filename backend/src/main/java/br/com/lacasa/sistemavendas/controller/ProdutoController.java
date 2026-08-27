package br.com.lacasa.sistemavendas.controller;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

import br.com.lacasa.sistemavendas.dto.ApiResponseDTO;
import br.com.lacasa.sistemavendas.dto.PaginaResponseDTO;
import br.com.lacasa.sistemavendas.dto.ProdutoRequestDTO;
import br.com.lacasa.sistemavendas.dto.ProdutoResponseDTO;
import br.com.lacasa.sistemavendas.exception.RegraNegocioException;
import br.com.lacasa.sistemavendas.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/produtos")
@RequiredArgsConstructor
@Tag(name = "Produtos", description = "Operações relacionadas ao gerenciamento de produtos")
public class ProdutoController {

	private static final Set<String> CAMPOS_ORDENACAO = Set.of("id", "nome", "preco", "quantidadeEstoque");

	private final ProdutoService produtoService;

	@Operation(summary = "Cadastrar produto", description = "Realiza o cadastro de um novo produto no estoque.")
	@ApiResponses({ @ApiResponse(responseCode = "201", description = "Produto cadastrado com sucesso"),
			@ApiResponse(responseCode = "400", description = "Dados inválidos ou regra de negócio violada"),
			@ApiResponse(responseCode = "401", description = "Usuário não autenticado"),
			@ApiResponse(responseCode = "403", description = "Usuario sem permissão para cadastrar produtos")

	})
	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponseDTO<ProdutoResponseDTO>> cadastrar(@Valid @RequestBody ProdutoRequestDTO dto) {
		ProdutoResponseDTO produto = produtoService.cadastrar(dto);
		ApiResponseDTO<ProdutoResponseDTO> resposta = new ApiResponseDTO<>(true, "Produto cadastrado com sucesso",
				produto);
		return ResponseEntity.ok(resposta);

	}

	@Operation(summary = "Listar produtos", description = "Retorna todos os produtos cadastrados no sistema.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Produtos encontrados com sucesso"),
			@ApiResponse(responseCode = "401", description = "Usuário não autenticado"),
			@ApiResponse(responseCode = "403", description = "Usuário sem permissão para acessar produtos") })
	@GetMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
	public ResponseEntity<List<ProdutoResponseDTO>> listarTodos() {
		return ResponseEntity.ok(produtoService.listarTodos());
	}

	
	@Operation(
		    summary = "Listar produtos paginados",
		    description = "Retorna os produtos cadastrados de forma paginada e ordenada."
		)
		@ApiResponses({
		    @ApiResponse(responseCode = "200", description = "Produtos encontrados com sucesso"),
		    @ApiResponse(responseCode = "400", description = "Parâmetros de paginação ou ordenação inválidos"),
		    @ApiResponse(responseCode = "401", description = "Usuário não autenticado")
		})
	@GetMapping("/paginado")
	public ResponseEntity<PaginaResponseDTO<ProdutoResponseDTO>> listarPaginado(
			@Parameter(description = "Número da página", example = "0")
			@RequestParam(defaultValue = "0") int pagina,

			@Parameter(description = "Quantidade de registros por página", example = "10")
			@RequestParam(defaultValue = "10") int tamanho,

			@Parameter(description = "Campo utilizado para ordenação", example = "nome")
			@RequestParam(defaultValue = "nome") String ordenarPor,

			@Parameter(description = "Direção da ordenação", example = "asc")
			@RequestParam(defaultValue = "asc") String direcao) {
		Pageable pageable = criarPageable(pagina, tamanho, ordenarPor, direcao);
		return ResponseEntity.ok(produtoService.listarPaginado(pageable));
	}

	@Operation(summary = "Buscar produto por ID", description = "Retorna um produto específico através do seu identificador.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "Produto encontrado com sucesso"),
	    @ApiResponse(responseCode = "401", description = "Usuário não autenticado"),
	    @ApiResponse(responseCode = "404", description = "Produto não encontrado")
	})
	@GetMapping("/{id}")
	public ResponseEntity<ProdutoResponseDTO> buscarPorId(
			@Parameter(description = "ID do produto", example = "1") @PathVariable Long id) {
		return ResponseEntity.ok(produtoService.buscarPorId(id));
	}

	
	@Operation(
		    summary = "Buscar produtos por nome",
		    description = "Realiza uma busca paginada de produtos utilizando o nome informado."
		)
		@ApiResponses({
		    @ApiResponse(responseCode = "200", description = "Busca realizada com sucesso"),
		    @ApiResponse(responseCode = "400", description = "Parâmetros de busca, paginação ou ordenação inválidos"),
		    @ApiResponse(responseCode = "401", description = "Usuário não autenticado")
		})
	@GetMapping("/buscar")
	public ResponseEntity<PaginaResponseDTO<ProdutoResponseDTO>> buscarPorNome(
			@Parameter(description = "Nome ou termo utilizado na busca", example = "Notebook")
			@RequestParam String nome,
			
			@Parameter(description = "Número da página", example = "0")
			@RequestParam(defaultValue = "0") int pagina,
			
			@Parameter(description = "Quantidade de registros por página", example = "10")
			@RequestParam(defaultValue = "10") int tamanho,
			
			@Parameter(description = "Campo utilizado para ordenação", example = "nome")
			@RequestParam(defaultValue = "nome") String ordenarPor,
			
			@Parameter(description = "Direção da ordenação", example = "asc")
			@RequestParam(defaultValue = "asc") String direcao) {
		Pageable pageable = criarPageable(pagina, tamanho, ordenarPor, direcao);
		return ResponseEntity.ok(produtoService.buscarPorNome(nome, pageable));
	}

	@Operation(summary = "Atualizar produto", description = "Atualiza os dados de um produto existente.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "Produto atualizado com sucesso"),
			@ApiResponse(responseCode = "400", description = "Dados inválidos ou tregra de negócio violada"),
			@ApiResponse(responseCode = "404", description = "Produto não encontrado"),
			@ApiResponse(responseCode = "401", description = "Usuário não autenticado"),
			@ApiResponse(responseCode = "403", description = "Usuário sem permissão") })
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ProdutoResponseDTO> atualizar(
			@Parameter(description = "ID do produto", example = "1") @PathVariable Long id,
			@Valid @RequestBody ProdutoRequestDTO dto) {
		return ResponseEntity.ok(produtoService.atualizar(id, dto));
	}

	@Operation(summary = "Excluir produto", description = "Remove um produto existente do sistema.")
	@ApiResponses({ @ApiResponse(responseCode = "204", description = "Produto excluído com sucesso"),
			@ApiResponse(responseCode = "404", description = "Produto não encontrado"),
			@ApiResponse(responseCode = "401", description = "Usuário não autenticado"),
			@ApiResponse(responseCode = "403", description = "Usuário sem permissão") })
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> deletar(
			@Parameter(description = "ID do produto", example = "1") @PathVariable Long id) {
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
		Sort sort = direcao.equalsIgnoreCase("desc") ? Sort.by(ordenarPor).descending()
				: Sort.by(ordenarPor).ascending();

		return PageRequest.of(pagina, tamanhoLimitado, sort);
	}
}
