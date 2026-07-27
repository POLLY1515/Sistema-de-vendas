package br.com.lacasa.sistemavendas.controller;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.lacasa.sistemavendas.dto.PedidoRequestDTO;
import br.com.lacasa.sistemavendas.dto.PedidoResponseDTO;
import br.com.lacasa.sistemavendas.dto.ResumoVendasDTO;
import br.com.lacasa.sistemavendas.entity.StatusPedido;
import br.com.lacasa.sistemavendas.service.PedidoService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> criar(
            @RequestBody @Valid PedidoRequestDTO request) {

        PedidoResponseDTO response =
                pedidoService.criarPedido(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponseDTO> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                pedidoService.buscarPorId(id)
        );
    }

    @GetMapping
    public ResponseEntity<Page<PedidoResponseDTO>> listarTodos(
            @PageableDefault(
                    size = 10,
                    sort = "dataCriacao",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable) {

        return ResponseEntity.ok(
                pedidoService.listarTodos(pageable)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<PedidoResponseDTO>> listarPorStatus(
            @PathVariable StatusPedido status,
            @PageableDefault(
                    size = 10,
                    sort = "dataCriacao",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable) {

        return ResponseEntity.ok(
                pedidoService.listarPorStatus(status, pageable)
        );
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<Page<PedidoResponseDTO>> listarPorCliente(
            @PathVariable Long clienteId,
            @PageableDefault(
                    size = 10,
                    sort = "dataCriacao",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable) {

        return ResponseEntity.ok(
                pedidoService.listarPorCliente(
                        clienteId,
                        pageable
                )
        );
    }

    @GetMapping("/periodo")
    public ResponseEntity<Page<PedidoResponseDTO>> listarPorPeriodo(
            @RequestParam
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE_TIME
            )
            LocalDateTime inicio,

            @RequestParam
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE_TIME
            )
            LocalDateTime fim,

            @PageableDefault(
                    size = 10,
                    sort = "dataCriacao",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable) {

        return ResponseEntity.ok(
                pedidoService.listarPorPeriodo(
                        inicio,
                        fim,
                        pageable
                )
        );
    }

    @GetMapping("/relatorio")
    public ResponseEntity<Page<PedidoResponseDTO>>
            listarPorStatusEPeriodo(

            @RequestParam StatusPedido status,

            @RequestParam
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE_TIME
            )
            LocalDateTime inicio,

            @RequestParam
            @DateTimeFormat(
                    iso = DateTimeFormat.ISO.DATE_TIME
            )
            LocalDateTime fim,

            @PageableDefault(
                    size = 10,
                    sort = "dataCriacao",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable) {

        return ResponseEntity.ok(
                pedidoService.listarPorStatusEPeriodo(
                        status,
                        inicio,
                        fim,
                        pageable
                )
        );
    }

    @GetMapping("/resumo")
    public ResponseEntity<ResumoVendasDTO> resumoVendas() {

        ResumoVendasDTO resumo =
                pedidoService
                        .gerarResumoDeVendasFinalizadas();

        return ResponseEntity.ok(resumo);
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<PedidoResponseDTO> cancelar(
            @PathVariable Long id) {

        PedidoResponseDTO response =
                pedidoService.cancelarPedido(id);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<PedidoResponseDTO> finalizar(
            @PathVariable Long id) {

        PedidoResponseDTO response =
                pedidoService.finalizarPedido(id);

        return ResponseEntity.ok(response);
    }
}