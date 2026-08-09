package br.com.lacasa.sistemavendas.dto;

public record LoginResponseDTO(
		String token,
		String tipo,
		UsuarioResponseDTO ususario
		
		) {

}
