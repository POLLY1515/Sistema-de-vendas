package br.com.lacasa.sistemavendas.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.lacasa.sistemavendas.dto.ItemPedidoRequestDTO;
import br.com.lacasa.sistemavendas.dto.ItemPedidoResponseDTO;
import br.com.lacasa.sistemavendas.dto.PedidoRequestDTO;
import br.com.lacasa.sistemavendas.dto.PedidoResponseDTO;
import br.com.lacasa.sistemavendas.entity.Cliente;
import br.com.lacasa.sistemavendas.entity.ItemPedido;
import br.com.lacasa.sistemavendas.entity.Pedido;
import br.com.lacasa.sistemavendas.entity.Produto;
import br.com.lacasa.sistemavendas.repository.ClienteRepository;
import br.com.lacasa.sistemavendas.repository.PedidoRepository;
import br.com.lacasa.sistemavendas.repository.ProdutoRepository;

@Service
public class PedidoService {
	
	private final PedidoRepository pedidoRepository;
	private final ClienteRepository clienteRepository;
	private final ProdutoRepository produtoRepository;
	
	
	public PedidoService(PedidoRepository pedidoRepository,
			             ClienteRepository clienteRepository,
			             ProdutoRepository produtoRepository) {
		this.pedidoRepository = pedidoRepository;
		this.clienteRepository = clienteRepository;
		this.produtoRepository = produtoRepository;
	}
	
	public PedidoResponseDTO criarPedido (PedidoRequestDTO request) {
		Cliente cliente = clienteRepository.findById(request.clienteId())
				.orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
		
		Pedido pedido = new Pedido();
		pedido.setCliente(cliente);
		
		for(ItemPedidoRequestDTO itemRequest : request.itens()) {
			Produto produto = produtoRepository.findById(itemRequest.produtoID())
					.orElseThrow(() -> new RuntimeException("Produto não encontrado"));
							
			ItemPedido item = new ItemPedido();
			item.setProduto(produto);
			item.setQuantidade(itemRequest.quantidade());
			item.setPrecoUnitario(produto.getPreco());
			item.calcularSubtotal();
			
			pedido.adicionarItem(item);
			
		} 
		
		pedido.calcularValorTotal();
		Pedido pedidoSalvo = pedidoRepository.save(pedido);
		
		return transformarEmResponse(pedidoSalvo);
		
	}
	
	
	public PedidoResponseDTO buscarPorId(Long id) {
		Pedido pedido = pedidoRepository.findById(id).orElseThrow(() -> new RuntimeException("Registro não encontrado"));
		
		return transformarEmResponse(pedido);
	}
	
	
	private PedidoResponseDTO transformarEmResponse(Pedido pedido) {
		
		List<ItemPedidoResponseDTO> itens = pedido.getItens()
				.stream()
				.map(item -> new ItemPedidoResponseDTO(
						item.getProduto().getId(),
						item.getProduto().getNome(),
						item.getQuantidade(),
						item.getPrecoUnitario(),
						item.getSubtotal()
						)).toList();
		
		return new PedidoResponseDTO(
				pedido.getId(),
				pedido.getCliente().getId(),
				pedido.getCliente().getNome(),
				pedido.getDataPedido(),
				pedido.getStatus(),
				pedido.getValorTotal(),
				itens
				);
	}

}
