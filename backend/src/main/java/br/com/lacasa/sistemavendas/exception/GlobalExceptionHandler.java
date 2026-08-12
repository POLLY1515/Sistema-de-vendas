package br.com.lacasa.sistemavendas.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import br.com.lacasa.sistemavendas.dto.ApiErrorDTO;
import br.com.lacasa.sistemavendas.dto.ErroResponseDTO;
import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(RecursoNaoEncontradoException.class)
	public ResponseEntity<ErroResponseDTO> tratarRecursoNaoEncontrado(RecursoNaoEncontradoException ex,
			HttpServletRequest request) {
		return criarResposta(HttpStatus.NOT_FOUND, ex.getMessage(), request);
	}

	@ExceptionHandler({ RegraNegocioException.class, EstoqueInsuficienteException.class })
	public ResponseEntity<ErroResponseDTO> tratarRegraNegocio(RuntimeException ex, HttpServletRequest request) {
		return criarResposta(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
	}


	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiErrorDTO> tratarErroDeValidacao(MethodArgumentNotValidException exception) {
		String mensagem = exception.getFieldErrors().stream().findFirst()
				.map(erro -> erro.getField() + ": " + erro.getDefaultMessage()).orElse("Dados invalidos");

		ApiErrorDTO erro = new ApiErrorDTO(false, "Erro de validação", mensagem, LocalDateTime.now());

		return ResponseEntity.badRequest().body(erro);
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ApiErrorDTO> tratarAcessoNegado(AccessDeniedException exception) {
		ApiErrorDTO erro = new ApiErrorDTO(false, "Acesso negado", "Voce nao tem permissao para acessar este recurso",
				LocalDateTime.now());
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(erro);

	}

	

	private ResponseEntity<ErroResponseDTO> criarResposta(HttpStatus status, String mensagem,
			HttpServletRequest request) {
		ErroResponseDTO erro = new ErroResponseDTO(LocalDateTime.now(), status.value(), status.getReasonPhrase(),
				mensagem, request.getRequestURI());

		return ResponseEntity.status(status).body(erro);
	}
}
