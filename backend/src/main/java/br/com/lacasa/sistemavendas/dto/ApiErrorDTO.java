package br.com.lacasa.sistemavendas.dto;

import java.time.LocalDateTime;

public record ApiErrorDTO(boolean sucesso, String titulo, String mensagem, LocalDateTime data) {
}
