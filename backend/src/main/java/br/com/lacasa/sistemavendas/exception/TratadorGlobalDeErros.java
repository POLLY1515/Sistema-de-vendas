package br.com.lacasa.sistemavendas.exception;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class TratadorGlobalDeErros {
	
	@ExceptionHandler(EstoqueInsuficienteException.class)
public ResponseEntity<Map<String, Object>> tratarEstoqueInsuficiente(
		EstoqueInsuficienteException erro
		
		){
		Map<String, Object> resposta = Map.of(
				"dataHora", LocalDateTime.now(),
				"status",400,
				"erro", "Estoque insufiente",
				"mensagem", erro.getMessage()
				);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resposta);
	}
}
