package br.com.lacasa.sistemavendas.dto;

import br.com.lacasa.sistemavendas.entity.PerfilUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UsuarioCadastroRequestDTO(
		
		@NotBlank(message = "Nome é obrigatório")
		String nome,
		
		@NotBlank(message = "Email é obrigatório")
		@Email(message = "E-mail inválido")
		String email,
		
		
		@NotBlank(message = "Senha é obrigatória")
		@Size(min = 6, message ="Senha deve ter no mínimo 6 caractéres")
		String senha,
		
		@NotNull(message = "Perfil é obrigatório")
		PerfilUsuario perfil
		
		
		
		) {

	
}
