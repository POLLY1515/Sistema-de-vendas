package br.com.lacasa.sistemavendas.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.lacasa.sistemavendas.dto.UsuarioCadastroRequestDTO;
import br.com.lacasa.sistemavendas.dto.UsuarioLoginRequestDTO;
import br.com.lacasa.sistemavendas.dto.UsuarioResponseDTO;
import br.com.lacasa.sistemavendas.dto.UsuarioResponseDTO.LoginResponseDTO;
import br.com.lacasa.sistemavendas.service.AuthService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {
	
	private final AuthService authService;

	
	public AuthController(AuthService athService) {
		this.authService = athService;
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
