package br.com.lacasa.sistemavendas.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import br.com.lacasa.sistemavendas.dto.ErroResponseDTO;
import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResponseDTO> tratarRecursoNaoEncontrado(
            RecursoNaoEncontradoException ex,
            HttpServletRequest request) {

        ErroResponseDTO erro = new ErroResponseDTO(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                ex.getMessage(),
                request.getRequestURI()
                
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
    }
    
    @ExceptionHandler(RegraNegocioException.class)
   public ResponseEntity<ErroResponseDTO> tratarRegraNegocio(
		   RegraNegocioException ex,
		   HttpServletRequest request
		   
	) {
    	
    		ErroResponseDTO erro = new ErroResponseDTO(
    				LocalDateTime.now(),
    				HttpStatus.BAD_REQUEST.value(),
    				"Bad Request",
    				ex.getMessage(),
    				request.getRequestURI()
    				
    				
    	);			
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
    	
    	
    	
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> tratarErroDeValidacao(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        Map<String, String> campos = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(erro -> {
            campos.put(erro.getField(), erro.getDefaultMessage());
        });

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("dataHora", LocalDateTime.now());
        resposta.put("status", HttpStatus.BAD_REQUEST.value());
        resposta.put("erro", "Bad Request");
        resposta.put("mensagem", "Existem campos inválidos");
        resposta.put("caminho", request.getRequestURI());
        resposta.put("campos", campos);

        return ResponseEntity.badRequest().body(resposta);
    }

}//parei pagina 131