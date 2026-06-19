package br.com.lacasa.sistemavendas.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.lacasa.sistemavendas.dto.PedidoRequestDTO;
import br.com.lacasa.sistemavendas.dto.PedidoResponseDTO;
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
	public ResponseEntity<PedidoResponseDTO> criar(@RequestBody @Valid PedidoRequestDTO request){
		PedidoResponseDTO response = pedidoService.criarPedido(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<PedidoResponseDTO>buscarPorId(@PathVariable Long id){
		return ResponseEntity.ok(pedidoService.buscarPorId(id));
	}
	
	@GetMapping
	public ResponseEntity<List<PedidoResponseDTO>>listarTodos(){
		return ResponseEntity.ok(pedidoService.listarTodos());
	}
	
	@PatchMapping("/{id}/cancelar")
	public ResponseEntity<PedidoResponseDTO> cancelar(@PathVariable long id){
		PedidoResponseDTO response = pedidoService.cancelarPedido(id);
		return ResponseEntity.ok(response);
	}
	
	@PatchMapping("/{id}/finalizar")
	public ResponseEntity<PedidoResponseDTO> finalizar(@PathVariable long id){
		PedidoResponseDTO response = pedidoService.finalizarPedido(id);
		return ResponseEntity.ok(response);
	}
}
