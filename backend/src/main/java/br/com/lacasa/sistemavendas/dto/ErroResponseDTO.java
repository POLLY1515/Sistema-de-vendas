package br.com.lacasa.sistemavendas.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ErroResponseDTO {

    private LocalDateTime dataHora;
    private int status;
    private String erro;
    private String mensagem;
    private String caminho;

}
