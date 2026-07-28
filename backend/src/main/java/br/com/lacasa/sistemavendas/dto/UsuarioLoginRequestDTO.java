package br.com.lacasa.sistemavendas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UsuarioLoginRequestDTO(

		@NotBlank(message = "Email é obrigatório") @Email(message = "E-mail inválido") String email,

		@NotBlank(message = "Senha é obrigatória") String senha

) {

}
