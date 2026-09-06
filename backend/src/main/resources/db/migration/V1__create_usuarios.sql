CREATE TABLE usuarios (
 id BIGSERIAL PRIMARY KEY,
 nome VARCHAR(120) NOT NULL,
 email VARCHAR(160) NOT NULL,
 senha VARCHAR(255) NOT NULL,
 perfil VARCHAR(30) NOT NULL,
 ativo BOOLEAN NOT NULL,
 data_criacao TIMESTAMP NOT NULL,
 CONSTRAINT ck_usuarios_perfil
 CHECK (perfil IN ('ADMIN', 'VENDEDOR'))
);
CREATE UNIQUE INDEX uk_usuarios_email_lower
 ON usuarios (LOWER(email));
