package br.com.lacasa.sistemavendas.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.lacasa.sistemavendas.dto.ClienteRequestDTO;
import br.com.lacasa.sistemavendas.dto.ClienteResponseDTO;
import br.com.lacasa.sistemavendas.dto.PaginaResponseDTO;
import br.com.lacasa.sistemavendas.entity.Cliente;
import br.com.lacasa.sistemavendas.exception.RecursoNaoEncontradoException;
import br.com.lacasa.sistemavendas.exception.RegraNegocioException;
import br.com.lacasa.sistemavendas.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteResponseDTO cadastrar(ClienteRequestDTO request) {
        validarEmailECpf(request.getEmail(), request.getCpf(), null);
        validarTelefone(request.getTelefone());
        
        Cliente cliente = new Cliente();
        cliente.setNome(request.getNome());
        cliente.setEmail(request.getEmail());
        cliente.setTelefone(request.getTelefone());
        cliente.setCpf(request.getCpf());

        Cliente clienteSalvo = clienteRepository.save(cliente);
        return converterParaResponse(clienteSalvo);
    }

    public List<ClienteResponseDTO> listarTodos() {
        return clienteRepository.findAll()
                .stream()
                .map(this::converterParaResponse)
                .toList();
    }

    public ClienteResponseDTO buscarPorId(Long id) {
        return converterParaResponse(buscarClienteOuFalhar(id));
    }

    public PaginaResponseDTO<ClienteResponseDTO> buscarPorTermo(String termo, Pageable pageable) {
        if (termo == null || termo.isBlank()) {
            throw new RegraNegocioException("Informe um termo para a busca de clientes.");
        }

        String termoNormalizado = termo.trim();
        Page<Cliente> pagina = clienteRepository
                .findByNomeContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        termoNormalizado,
                        termoNormalizado,
                        pageable
                );

        return montarPaginaResponse(pagina.map(this::converterParaResponse));
    }

    public ClienteResponseDTO atualizar(Long id, ClienteRequestDTO request) {
        Cliente cliente = buscarClienteOuFalhar(id);
        validarEmailECpf(request.getEmail(), request.getCpf(), id);

        cliente.setNome(request.getNome());
        cliente.setEmail(request.getEmail());
        cliente.setTelefone(request.getTelefone());
        cliente.setCpf(request.getCpf());

        return converterParaResponse(clienteRepository.save(cliente));
    }

    public void remover(Long id) {
        clienteRepository.delete(buscarClienteOuFalhar(id));
    }

    private Cliente buscarClienteOuFalhar(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Cliente com ID " + id + " não encontrado."
                ));
    }

    private void validarEmailECpf(String email, String cpf, Long idAtual) {
        boolean emailJaCadastrado = idAtual == null
                ? clienteRepository.existsByEmailIgnoreCase(email)
                : clienteRepository.existsByEmailIgnoreCaseAndIdNot(email, idAtual);

        if (emailJaCadastrado) {
            throw new RegraNegocioException("Já existe um cliente cadastrado com este e-mail.");
        }

        boolean cpfJaCadastrado = idAtual == null
                ? clienteRepository.existsByCpf(cpf)
                : clienteRepository.existsByCpfAndIdNot(cpf, idAtual);

        if (cpfJaCadastrado) {
            throw new RegraNegocioException("Já existe um cliente cadastrado com este CPF.");
        }
    }
    
    private void validarTelefone(String telefone) {
    	
    		if(clienteRepository.existsByTelefone(telefone)) {
    			throw new  RegraNegocioException("Já existe um cliente cadastrado com este Telefone!");
    		}
    }
    
    
    private ClienteResponseDTO converterParaResponse(Cliente cliente) {
        return new ClienteResponseDTO(
                cliente.getId(),
                cliente.getNome(),
                cliente.getEmail(),
                cliente.getTelefone(),
                cliente.getCpf()
        );
    }

    private PaginaResponseDTO<ClienteResponseDTO> montarPaginaResponse(Page<ClienteResponseDTO> pagina) {
        return new PaginaResponseDTO<>(
                pagina.getContent(),
                pagina.getNumber(),
                pagina.getSize(),
                pagina.getTotalElements(),
                pagina.getTotalPages(),
                pagina.isFirst(),
                pagina.isLast()
        );
    }
}
