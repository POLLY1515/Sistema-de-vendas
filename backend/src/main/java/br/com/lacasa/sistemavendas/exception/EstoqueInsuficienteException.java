package br.com.lacasa.sistemavendas.exception;

public class EstoqueInsuficienteException extends RuntimeException {

	public EstoqueInsuficienteException(String mensagem) {
		super(mensagem);
	}
}
