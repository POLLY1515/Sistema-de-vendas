package br.com.lacasa.sistemavendas.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.lacasa.sistemavendas.dto.ClienteRequestDTO;
import br.com.lacasa.sistemavendas.dto.ClienteResponseDTO;
import br.com.lacasa.sistemavendas.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class ClienteController {
	
	private final ClienteService clienteService;
	
	@PostMapping
	public ResponseEntity<ClienteResponseDTO> cadastrar(@Valid @RequestBody ClienteRequestDTO request){
		ClienteResponseDTO cliente = clienteService.cadastrar(request);
		return  ResponseEntity.status(HttpStatus.CREATED).body(cliente);
	
	}
	
	
	@GetMapping
	public ResponseEntity<List<ClienteResponseDTO>> listar(){
		return ResponseEntity.ok(clienteService.listarTodos());
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<ClienteResponseDTO> buscarPorId(@PathVariable Long id){
		return ResponseEntity.ok(clienteService.buscarPorId(id));
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<ClienteResponseDTO>atualizar(@PathVariable Long id, @Valid @RequestBody ClienteRequestDTO request){
		ClienteResponseDTO cliente = clienteService.atualizar(id, request);
		return ResponseEntity.ok(cliente);
	}
	
	
}
