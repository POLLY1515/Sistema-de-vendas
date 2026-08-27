package br.com.lacasa.sistemavendas.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.lacasa.sistemavendas.dto.LoginResponseDTO;
import br.com.lacasa.sistemavendas.dto.UsuarioCadastroRequestDTO;
import br.com.lacasa.sistemavendas.dto.UsuarioLogadoDTO;
import br.com.lacasa.sistemavendas.dto.UsuarioLoginRequestDTO;
import br.com.lacasa.sistemavendas.dto.UsuarioResponseDTO;
import br.com.lacasa.sistemavendas.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Autenticação", description = "Operações relacionadas ao cadastro, login e autenticação de usuários")
@RestController
@RequestMapping("/auth")
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService athService) {
		this.authService = athService;
	}

	@Operation(summary = "Obter usuário autenticado",
			description = "Retorna os dados do usuário atualmente autenticado no sistema.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "Usuário autenticado retornado com sucesso"),
	    @ApiResponse(responseCode = "401", description = "Usuário não autenticado")
	})
	@GetMapping("/me")
	public UsuarioLogadoDTO usuarioLogado(Authentication autentication) {
		String email = autentication.getName();
		String perfil = autentication.getAuthorities().stream().findFirst()
				.map(autoridade -> autoridade.getAuthority().replace("ROLE_", "")).orElse("SEM_PERFIL");

		return new UsuarioLogadoDTO(email, perfil);
	}

	
	@Operation(
		    summary = "Cadastrar usuário",
		    description = "Realiza o cadastro de um novo usuário no sistema."
		)
		@ApiResponses({
		    @ApiResponse(responseCode = "201", description = "Usuário cadastrado com sucesso"),
		    @ApiResponse(responseCode = "400", description = "Dados inválidos enviado na requisição")
		})
	@PostMapping("/cadastrar")
	public ResponseEntity<UsuarioResponseDTO> cadastrar(@RequestBody @Valid UsuarioCadastroRequestDTO dto) {

		UsuarioResponseDTO usuario = authService.cadastrar(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
	}

	
	@Operation(
		    summary = "Realizar login",
		    description = "Autentica o usuário no sistema e retorna os dados de acesso."
		)
		@ApiResponses({
		    @ApiResponse(responseCode = "200", description = "Login realizado com sucesso"),
		    @ApiResponse(responseCode = "400", description = "Dados inválidos na requisição")
		})
	@PostMapping("/login")
	public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid UsuarioLoginRequestDTO dto) {
		return ResponseEntity.ok(authService.login(dto));
	}
}
