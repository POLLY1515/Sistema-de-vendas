CREATE TABLE produtos (

    id BIGSERIAL PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,

    preco NUMERIC(10,2) NOT NULL,

    quantidade_estoque INTEGER NOT NULL,

    CONSTRAINT ck_produtos_preco_positivo 
        CHECK (preco > 0),

    CONSTRAINT ck_produtos_estoque_nao_negativo 
        CHECK (quantidade_estoque >= 0)

);

CREATE UNIQUE INDEX uk_produtos_nome_lower
ON produtos (LOWER(nome));