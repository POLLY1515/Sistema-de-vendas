package br.com.lacasa.sistemavendas.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import br.com.lacasa.sistemavendas.dto.ItemPedidoRequestDTO;
import br.com.lacasa.sistemavendas.dto.ItemPedidoResponseDTO;
import br.com.lacasa.sistemavendas.dto.PedidoRequestDTO;
import br.com.lacasa.sistemavendas.dto.PedidoResponseDTO;
import br.com.lacasa.sistemavendas.dto.ResumoVendasDTO;
import br.com.lacasa.sistemavendas.entity.Cliente;
import br.com.lacasa.sistemavendas.entity.ItemPedido;
import br.com.lacasa.sistemavendas.entity.Pedido;
import br.com.lacasa.sistemavendas.entity.Produto;
import br.com.lacasa.sistemavendas.entity.StatusPedido;
import br.com.lacasa.sistemavendas.repository.ClienteRepository;
import br.com.lacasa.sistemavendas.repository.PedidoRepository;
import br.com.lacasa.sistemavendas.repository.ProdutoRepository;
import jakarta.transaction.Transactional;

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
	
	@Transactional
	public PedidoResponseDTO criarPedido(PedidoRequestDTO request) {

	    Cliente cliente = clienteRepository.findById(request.clienteId())
	            .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

	    Pedido pedido = new Pedido();
	    pedido.setCliente(cliente);

	    for (ItemPedidoRequestDTO itemRequest : request.itens()) {

	        Produto produto = produtoRepository.findById(itemRequest.produtoId())
	                .orElseThrow(() -> new RuntimeException(
	                        "Produto não encontrado: " + itemRequest.produtoId()
	                ));

	        produto.baixarEstoque(itemRequest.quantidade());

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
	
	@Transactional
	public PedidoResponseDTO cancelarPedido(Long id) {
		Pedido pedido = pedidoRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Pedido não encontrado!"));
		if(pedido.getStatus()== StatusPedido.CANCELADO) {
			throw new RuntimeException("Este pedido já foi cancelado!");
		}
		for(ItemPedido item : pedido.getItens()) {
			Produto produto = item.getProduto();
			produto.devolverEstoque(item.getQuantidade());
		}
		
		pedido.setStatus(StatusPedido.CANCELADO);
		Pedido pedidoSalvo = pedidoRepository.save(pedido);
		
		return transformarEmResponse(pedidoSalvo);
	}
	
	@Transactional
	public PedidoResponseDTO finalizarPedido(Long id) {
		
		Pedido pedido = pedidoRepository.findById(id)
				.orElseThrow(()-> new RuntimeException("Pedido não encontrado"));
		if(pedido.getStatus()== StatusPedido.CANCELADO) {
			throw new RuntimeException("Não é possível finalizar um pedido cancelado!");

		}
		if(pedido.getStatus()== StatusPedido.FINALIZADO) {
			throw new RuntimeException("Este pedido já está finalizado!");
		}
		
		pedido.setStatus(StatusPedido.FINALIZADO);
		Pedido pedidoSalvo = pedidoRepository.save(pedido);
		
		return transformarEmResponse(pedidoSalvo);
	}
	
	
	
	public PedidoResponseDTO buscarPorId(Long id) {
		Pedido pedido = pedidoRepository.findById(id).orElseThrow(() -> new RuntimeException("Registro não encontrado"));
		
		return transformarEmResponse(pedido);
	}
	
	
	public List<PedidoResponseDTO> listarTodos(){
		return pedidoRepository.findAll()
				.stream()
				.map(this:: transformarEmResponse)
				.toList();
	}
	
	

	public List<PedidoResponseDTO> listarPorStatus(StatusPedido status){
		return pedidoRepository.findByStatus(status)
				
				.stream()
				.map(this:: transformarEmResponse)
				.toList();
	}
	
	
	public List<PedidoResponseDTO> listarPorCliente(Long clienteId){
		return pedidoRepository.findByClienteId(clienteId)	
				.stream()
				.map(this:: transformarEmResponse)
				.toList();
	}
	
	
	public List<PedidoResponseDTO> listarPorPeriodo(LocalDateTime inicio, LocalDateTime fim){
		return pedidoRepository.findByDataCriacaoBetween(inicio, fim)
				.stream()
				.map(this:: transformarEmResponse)
				.toList();
	}
	
	
	public List<PedidoResponseDTO> listarPorStatusEPeriodo(StatusPedido status,LocalDateTime inicio, LocalDateTime fim){
		return pedidoRepository.findByStatusAndDataCriacaoBetween(status, inicio, fim)
				.stream()
				.map(this:: transformarEmResponse)
				.toList();
	}
	
	public ResumoVendasDTO gerarResumoDeVendasFinalizadas() {
		List<Pedido> pedidosFinalizados = pedidoRepository.findByStatus(StatusPedido.FINALIZADO);
		
		BigDecimal totalVendido = pedidosFinalizados.stream()
				.map(Pedido::getValorTotal)
				.reduce(BigDecimal.ZERO, BigDecimal::add);
		
		Long quantidadePedidos = (long) pedidosFinalizados.size();
		
		return new ResumoVendasDTO(quantidadePedidos,totalVendido
				);
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
	            ))
	            .toList();

	    return new PedidoResponseDTO(
	            pedido.getId(),
	            pedido.getCliente().getId(),
	            pedido.getCliente().getNome(),
	            pedido.getDataCriacao(),
	            pedido.getStatus(),
	            pedido.getDataCriacao(),
	            pedido.getValorTotal(),
	            itens
	    );
	}
}
