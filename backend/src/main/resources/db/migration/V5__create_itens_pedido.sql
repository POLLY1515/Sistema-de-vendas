CREATE TABLE itens_pedido (
 id BIGSERIAL PRIMARY KEY,
 pedido_id BIGINT NOT NULL,
 produto_id BIGINT NOT NULL,
 quantidade INTEGER NOT NULL,
 preco_unitario NUMERIC(10,2) NOT NULL,
 subtotal NUMERIC(10,2) NOT NULL,
 CONSTRAINT fk_itens_pedido
 FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
 CONSTRAINT fk_itens_produto
 FOREIGN KEY (produto_id) REFERENCES produtos(id),
 CONSTRAINT ck_itens_quantidade CHECK (quantidade > 0),
 CONSTRAINT ck_itens_preco CHECK (preco_unitario > 0),
 CONSTRAINT ck_itens_subtotal CHECK (subtotal > 0)
);
CREATE INDEX idx_itens_pedido ON itens_pedido(pedido_id);
CREATE INDEX idx_itens_produto ON itens_pedido(produto_id);