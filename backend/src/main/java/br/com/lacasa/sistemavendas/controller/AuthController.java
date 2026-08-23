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
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {
	
	private final AuthService authService;

	
	public AuthController(AuthService athService) {
		this.authService = athService;
	}
	
	@GetMapping("/me")
	public UsuarioLogadoDTO usuarioLogado(Authentication autentication) {
		String email = autentication.getName();
		String perfil = autentication.getAuthorities()
				.stream()
				.findFirst()
				.map(autoridade -> autoridade.getAuthority().replace("ROLE_", ""))
				.orElse("SEM_PERFIL");
		
		return new UsuarioLogadoDTO(email, perfil);
	}
	
	@PostMapping("/cadastrar")
	public ResponseEntity<UsuarioResponseDTO> cadastrar(@RequestBody @Valid UsuarioCadastroRequestDTO dto){
		
		UsuarioResponseDTO usuario = authService.cadastrar(dto);
		return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
	}
	
	@PostMapping("/login")
	public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid UsuarioLoginRequestDTO dto){
		return ResponseEntity.ok(authService.login(dto));
	}
}
