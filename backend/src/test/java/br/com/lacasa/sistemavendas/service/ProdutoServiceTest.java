package br.com.lacasa.sistemavendas.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import br.com.lacasa.sistemavendas.dto.ProdutoRequestDTO;
import br.com.lacasa.sistemavendas.dto.ProdutoResponseDTO;
import br.com.lacasa.sistemavendas.entity.Produto;
import br.com.lacasa.sistemavendas.repository.ProdutoRepository;


@ExtendWith(MockitoExtension.class)
class ProdutoServiceTest {

    @Mock
    private ProdutoRepository produtoRepository;

    @InjectMocks
    private ProdutoService produtoService;


    @Test
    void deveCadastrarProdutoComSucesso() {

        ProdutoRequestDTO request =
                new ProdutoRequestDTO(
                        "Notebook",
                        new BigDecimal("3500.00"),
                        10
                );


        Produto produtoSalvo = new Produto();

        produtoSalvo.setId(1L);
        produtoSalvo.setNome("Notebook");
        produtoSalvo.setPreco(new BigDecimal("3500.00"));
        produtoSalvo.setQuantidadeEstoque(10);


        when(produtoRepository.save(any(Produto.class)))
                .thenReturn(produtoSalvo);


        ProdutoResponseDTO response =
                produtoService.cadastrar(request);


        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Notebook", response.getNome());
        assertEquals(new BigDecimal("3500.00"), response.getPreco());
        assertEquals(10, response.getQuantidadeEstoque());
    }
}