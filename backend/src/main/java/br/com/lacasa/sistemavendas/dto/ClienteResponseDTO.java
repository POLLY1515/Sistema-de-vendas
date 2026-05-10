package br.com.lacasa.sistemavendas.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ClienteResponseDTO {
	
	private Long id;
	private String nome;
	private String email;
	private String telefone;
	private String cpf;

	
}
