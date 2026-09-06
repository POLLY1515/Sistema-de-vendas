CREATE TABLE pedidos (
 id BIGSERIAL PRIMARY KEY,
 cliente_id BIGINT NOT NULL,
 data_pedido TIMESTAMP NOT NULL,
 status VARCHAR(30) NOT NULL,
 data_criacao TIMESTAMP NOT NULL,
 valor_total NUMERIC(10,2) NOT NULL,
 CONSTRAINT fk_pedidos_cliente
 FOREIGN KEY (cliente_id) REFERENCES clientes(id),
 CONSTRAINT ck_pedidos_status
 CHECK (status IN ('ABERTO', 'FINALIZADO', 'CANCELADO')),
 CONSTRAINT ck_pedidos_valor_total
 CHECK (valor_total >= 0)
);
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_pedidos_data_criacao ON pedidos(data_criacao);
