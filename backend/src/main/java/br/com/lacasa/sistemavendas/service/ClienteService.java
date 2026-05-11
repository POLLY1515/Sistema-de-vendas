package br.com.lacasa.sistemavendas.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.lacasa.sistemavendas.dto.ClienteRequestDTO;
import br.com.lacasa.sistemavendas.dto.ClienteResponseDTO;
import br.com.lacasa.sistemavendas.entity.Cliente;
import br.com.lacasa.sistemavendas.exception.RecursoNaoEncontradoException;
import br.com.lacasa.sistemavendas.exception.RegraNegocioException;
import br.com.lacasa.sistemavendas.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClienteService {
	
	private final ClienteRepository clienteRepository;
	
	public ClienteResponseDTO cadastrar (ClienteRequestDTO request) {
		validarEmailECpf(request.getEmail(), request.getCpf(), null);
		
		Cliente cliente = new Cliente();
		cliente.setNome(request.getNome());
		cliente.setEmail(request.getEmail());
		cliente.setTelefone(request.getTelefone());
		cliente.setCpf(request.getCpf());
		
		Cliente clienteSalvo = clienteRepository.save(cliente);
		return converteParaResponseDTO(clienteSalvo);
	}
	
	
	public List<ClienteResponseDTO> listarTodos(){
		return clienteRepository.findAll()
				.stream()
				.map(this:: converteParaResponseDTO)
				.toList();
	}
	
	public ClienteResponseDTO buscarPorId (Long id) {
		Cliente cliente = buscarClienetOuFalhar(id);
		return converteParaResponseDTO(cliente);
	}
	
	private Cliente buscarClienetOuFalhar(Long id) {
		return clienteRepository.findById(id)
				.orElseThrow(() -> new RecursoNaoEncontradoException(
						"Cliente com ID " + id + " não encontrado!"));
		
	}
	
	
	private ClienteResponseDTO converteParaResponseDTO(Cliente cliente) {
		return new ClienteResponseDTO(
				cliente.getId(),
				cliente.getNome(),
				cliente.getEmail(),
				cliente.getTelefone(),
				cliente.getCpf()
				);
	}


	private void validarEmailECpf(String email, String cpf, Long idAtual) {
		clienteRepository.findAll().forEach(cliente -> {
			boolean mesmoCliente = idAtual != null && cliente.getId().equals(idAtual);
			
			if(!mesmoCliente && cliente.getEmail().equalsIgnoreCase(email)) {
			throw new RegraNegocioException("já existe cliente cadastrado com este e-mail ");
			
			}
			
		});
		
	}
	

}
