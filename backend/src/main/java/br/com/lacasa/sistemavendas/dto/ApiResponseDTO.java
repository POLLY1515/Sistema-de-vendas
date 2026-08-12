package br.com.lacasa.sistemavendas.dto;

public record ApiResponseDTO<T>(
		
		boolean sucesso,
		String mensagem, 
		T dados) {

}
