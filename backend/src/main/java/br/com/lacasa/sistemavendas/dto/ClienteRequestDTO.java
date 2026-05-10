package br.com.lacasa.sistemavendas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClienteRequestDTO {
	
	@NotBlank(message = "O nome do cliente é obrigatório")
	@Size(min = 3, max = 120, message= "O nome deve ter entre 3 e 120 caracteres")
	private String nome;
	
	@NotBlank(message = "O email é obrigatório")
	@Email( message= "Informe um email válido")
	private String email;
	
	@NotBlank(message = "O telefone é obrigatório")
	@Pattern(regexp = "\\d{10,11}", message = "O telefone deve ter 10 ou 11  números")
	private String telefone;
	
	@NotBlank(message = "O cpf é obrigatório")
	@Pattern(regexp = "\\d{11}", message = "O cpf deve ter exatamente 11 números")
	private String cpf;
	

}
