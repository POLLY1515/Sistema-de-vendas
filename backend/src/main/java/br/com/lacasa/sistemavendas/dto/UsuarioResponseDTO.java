package br.com.lacasa.sistemavendas.dto;

import br.com.lacasa.sistemavendas.entity.PerfilUsuario;

public record UsuarioResponseDTO(

		Long id,
		String nome,
		String email,
		PerfilUsuario perfil,
		Boolean ativo

) {
	
	public record LoginResponseDTO(
			String mensagem,
			UsuarioResponseDTO usuario
			
			) {
		
	}
	

}
