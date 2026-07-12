# Sistema de Vendas

Sistema back-end desenvolvido em Java para gerenciamento de vendas, com foco em organização de código, regras de negócio e manipulação de dados.

## 🚀 Objetivo

O objetivo deste projeto é simular uma aplicação de vendas, permitindo estruturar funcionalidades comuns em sistemas comerciais, como cadastro, controle e processamento de informações.


## 🛠️ Tecnologias utilizadas

* Java 21
* Spring Boot
* Spring Data JPA
* PostgreSQL
* Maven
* Bean Validation
* Lombok
* Git e GitHub



## ✅ Funcionalidades implementadas

* Cadastro de produtos
* Listagem e busca de produtos
* Atualização de produtos
* Exclusão de produtos
* Consulta de pedidos
* Geração de resumo de dados

* ## ▶️ Como executar o projeto

### Pré-requisitos

- Java 21
- PostgreSQL
- Git

### Configuração

1. Clone o repositório:

```bash
git clone https://github.com/POLLY1515/Sistema-de-vendas.git
```

2. Crie no PostgreSQL um banco chamado:

```text
sistema-vendas
```

3. Configure a variável `DB_PASSWORD` com a senha do seu PostgreSQL.

4. Entre na pasta do back-end:

```bash
cd Sistema-de-vendas/backend
```

5. Execute o projeto no Windows:

```bash
mvnw.cmd spring-boot:run
```

A aplicação será iniciada em:

```text
http://localhost:8080
```
## 📦 Endpoints de produtos

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/produtos` | Cadastra um produto |
| GET | `/produtos` | Lista todos os produtos |
| GET | `/produtos/{id}` | Busca um produto pelo ID |
| PUT | `/produtos/{id}` | Atualiza um produto |
| DELETE | `/produtos/{id}` | Exclui um produto |

### Exemplo de requisição

```json
{
  "nome": "Notebook",
  "preco": 3500.00,
  "quantidadeEstoque": 10
}
```

### Exemplo de resposta

```json
{
  "id": 1,
  "nome": "Notebook",
  "preco": 3500.00,
  "quantidadeEstoque": 10
}
```

## 📚 Aprendizados

Durante o desenvolvimento deste projeto, foram praticados conceitos como:

- Organização de camadas
- Estruturação de projetos Java
- Regras de negócio
- Persistência de dados
- Boas práticas no desenvolvimento back-end

## 👩‍💻 Desenvolvedora

Projeto desenvolvido por Poliana Amarante.
## 🚧 Status do projeto

Em desenvolvimento. O back-end já possui operações de cadastro, consulta, atualização e exclusão de produtos, além da consulta de pedidos e geração de resumo.

