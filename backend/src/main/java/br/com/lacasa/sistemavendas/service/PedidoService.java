package br.com.lacasa.sistemavendas.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
import br.com.lacasa.sistemavendas.exception.RecursoNaoEncontradoException;
import br.com.lacasa.sistemavendas.exception.RegraNegocioException;
import br.com.lacasa.sistemavendas.repository.ClienteRepository;
import br.com.lacasa.sistemavendas.repository.PedidoRepository;
import br.com.lacasa.sistemavendas.repository.ProdutoRepository;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;

    public PedidoService(
            PedidoRepository pedidoRepository,
            ClienteRepository clienteRepository,
            ProdutoRepository produtoRepository) {

        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.produtoRepository = produtoRepository;
    }

    @Transactional
    public PedidoResponseDTO criarPedido(PedidoRequestDTO request) {

        Cliente cliente = clienteRepository
                .findById(request.clienteId())
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Cliente não encontrado."
                        )
                );

        if (request.itens() == null || request.itens().isEmpty()) {
            throw new RegraNegocioException(
                    "O pedido deve possuir pelo menos um item."
            );
        }

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);

        for (ItemPedidoRequestDTO itemRequest : request.itens()) {

            Produto produto = produtoRepository
                    .findById(itemRequest.produtoId())
                    .orElseThrow(() ->
                            new RecursoNaoEncontradoException(
                                    "Produto não encontrado: "
                                            + itemRequest.produtoId()
                            )
                    );

            /*
             * A própria entidade Produto valida:
             * - quantidade nula;
             * - quantidade igual ou menor que zero;
             * - estoque insuficiente.
             */
            produto.baixarEstoque(itemRequest.quantidade());

            ItemPedido item = new ItemPedido();
            item.setProduto(produto);
            item.setQuantidade(itemRequest.quantidade());

            /*
             * O preço atual do produto é copiado para o item.
             * Assim, o pedido mantém o preço praticado no momento da venda.
             */
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

        Pedido pedido = buscarEntidadePorId(id);

        if (pedido.getStatus() == StatusPedido.CANCELADO) {
            throw new RegraNegocioException(
                    "Este pedido já foi cancelado."
            );
        }

        if (pedido.getStatus() == StatusPedido.FINALIZADO) {
            throw new RegraNegocioException(
                    "Não é possível cancelar um pedido finalizado."
            );
        }

        for (ItemPedido item : pedido.getItens()) {
            Produto produto = item.getProduto();
            produto.devolverEstoque(item.getQuantidade());
        }

        pedido.setStatus(StatusPedido.CANCELADO);

        Pedido pedidoSalvo = pedidoRepository.save(pedido);

        return transformarEmResponse(pedidoSalvo);
    }

    @Transactional
    public PedidoResponseDTO finalizarPedido(Long id) {

        Pedido pedido = buscarEntidadePorId(id);

        if (pedido.getStatus() == StatusPedido.CANCELADO) {
            throw new RegraNegocioException(
                    "Não é possível finalizar um pedido cancelado."
            );
        }

        if (pedido.getStatus() == StatusPedido.FINALIZADO) {
            throw new RegraNegocioException(
                    "Este pedido já está finalizado."
            );
        }

        pedido.setStatus(StatusPedido.FINALIZADO);

        Pedido pedidoSalvo = pedidoRepository.save(pedido);

        return transformarEmResponse(pedidoSalvo);
    }

    @Transactional(readOnly = true)
    public PedidoResponseDTO buscarPorId(Long id) {

        Pedido pedido = buscarEntidadePorId(id);

        return transformarEmResponse(pedido);
    }

    @Transactional(readOnly = true)
    public Page<PedidoResponseDTO> listarTodos(Pageable pageable) {

        return pedidoRepository
                .findAll(pageable)
                .map(this::transformarEmResponse);
    }

    @Transactional(readOnly = true)
    public Page<PedidoResponseDTO> listarPorStatus(
            StatusPedido status,
            Pageable pageable) {

        return pedidoRepository
                .findByStatus(status, pageable)
                .map(this::transformarEmResponse);
    }

    @Transactional(readOnly = true)
    public Page<PedidoResponseDTO> listarPorCliente(
            Long clienteId,
            Pageable pageable) {

        /*
         * Essa verificação diferencia:
         * cliente inexistente de cliente existente sem pedidos.
         */
        if (!clienteRepository.existsById(clienteId)) {
            throw new RecursoNaoEncontradoException(
                    "Cliente não encontrado."
            );
        }

        return pedidoRepository
                .findByClienteId(clienteId, pageable)
                .map(this::transformarEmResponse);
    }

    @Transactional(readOnly = true)
    public Page<PedidoResponseDTO> listarPorPeriodo(
            LocalDateTime inicio,
            LocalDateTime fim,
            Pageable pageable) {

        validarPeriodo(inicio, fim);

        return pedidoRepository
                .findByDataCriacaoBetween(inicio, fim, pageable)
                .map(this::transformarEmResponse);
    }

    @Transactional(readOnly = true)
    public Page<PedidoResponseDTO> listarPorStatusEPeriodo(
            StatusPedido status,
            LocalDateTime inicio,
            LocalDateTime fim,
            Pageable pageable) {

        validarPeriodo(inicio, fim);

        return pedidoRepository
                .findByStatusAndDataCriacaoBetween(
                        status,
                        inicio,
                        fim,
                        pageable
                )
                .map(this::transformarEmResponse);
    }

    @Transactional(readOnly = true)
    public ResumoVendasDTO gerarResumoDeVendasFinalizadas() {

        /*
         * Pageable.unpaged() utiliza o mesmo método paginado,
         * mas solicita todos os registros finalizados.
         *
         * Para uma aplicação com muitos pedidos, o ideal futuro
         * é calcular o resumo diretamente no banco com SUM e COUNT.
         */
        Page<Pedido> paginaPedidosFinalizados =
                pedidoRepository.findByStatus(
                        StatusPedido.FINALIZADO,
                        Pageable.unpaged()
                );

        BigDecimal totalVendido = paginaPedidosFinalizados
                .getContent()
                .stream()
                .map(Pedido::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long quantidadePedidos =
                paginaPedidosFinalizados.getTotalElements();

        return new ResumoVendasDTO(
                quantidadePedidos,
                totalVendido
        );
    }

    private Pedido buscarEntidadePorId(Long id) {

        return pedidoRepository
                .findById(id)
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Pedido não encontrado."
                        )
                );
    }

    private void validarPeriodo(
            LocalDateTime inicio,
            LocalDateTime fim) {

        if (inicio == null || fim == null) {
            throw new RegraNegocioException(
                    "As datas inicial e final são obrigatórias."
            );
        }

        if (inicio.isAfter(fim)) {
            throw new RegraNegocioException(
                    "A data inicial não pode ser posterior à data final."
            );
        }
    }

    private PedidoResponseDTO transformarEmResponse(Pedido pedido) {

        List<ItemPedidoResponseDTO> itens = pedido
                .getItens()
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
                pedido.getDataPedido(),

                pedido.getStatus(),
                pedido.getDataCriacao(),
                pedido.getValorTotal(),
                itens
        );
    }
}