# Sistema de Vendas API

API REST backend desenvolvida em **Java 21 utilizando Spring Boot** para gerenciamento de operações comerciais.

O projeto implementa uma aplicação de vendas com gerenciamento de usuários, clientes, produtos e pedidos, aplicando boas práticas de desenvolvimento backend, arquitetura em camadas, persistência de dados e autenticação segura.

---

# 🚀 Objetivo

Construir uma aplicação backend simulando um sistema comercial, aplicando conceitos utilizados no desenvolvimento de APIs profissionais.

O projeto contempla:

- gerenciamento de usuários;
- autenticação e autorização;
- cadastro de clientes;
- cadastro de produtos;
- operações relacionadas a pedidos.

---

# 🛠️ Tecnologias utilizadas

- Java 21
- Spring Boot
- Spring Security
- JWT (JSON Web Token)
- Spring Data JPA
- Hibernate
- PostgreSQL
- Maven
- Lombok
- Bean Validation
- Git e GitHub

---

# 🏗️ Arquitetura

A aplicação utiliza arquitetura em camadas, separando responsabilidades entre os componentes do sistema.

```
Controller
      |
      ↓
Service
      |
      ↓
Repository
      |
      ↓
Database PostgreSQL
```

## Camadas

### Controller

Responsável por:

- receber requisições HTTP;
- validar entradas;
- retornar respostas da API através de DTOs.

---

### Service

Responsável por:

- regras de negócio;
- processamento das operações;
- conversão entre DTOs e entidades.

---

### Repository

Responsável pela comunicação com o banco de dados utilizando Spring Data JPA.

---

### Entity

Representa as entidades persistidas no banco de dados.

---

### DTO

Responsável pela comunicação entre API e cliente, evitando exposição direta das entidades.

---

# 🔐 Segurança

A aplicação utiliza Spring Security com autenticação baseada em JWT.

Funcionalidades implementadas:

- autenticação de usuários;
- geração de token JWT;
- validação de token;
- proteção de endpoints;
- controle de acesso por perfil de usuário.

Perfis utilizados:

- ADMIN
- VENDEDOR

---

# ✅ Funcionalidades implementadas

## Usuários

✔ Cadastro de usuários

✔ Autenticação através de login

✔ Geração de token JWT


## Clientes

✔ Cadastro de clientes

✔ Consulta de clientes

✔ Busca por ID

✔ Atualização

✔ Exclusão


## Produtos

✔ Cadastro de produtos

✔ Listagem de produtos

✔ Busca por ID

✔ Atualização

✔ Exclusão


## Pedidos

✔ Consulta de pedidos

✔ Gerenciamento de operações relacionadas às vendas

---

# 📌 Endpoints principais

## Autenticação

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/auth/login` | Autenticação do usuário |


## Produtos

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/produtos` | Cadastrar produto |
| GET | `/produtos` | Listar produtos |
| GET | `/produtos/{id}` | Buscar produto |
| PUT | `/produtos/{id}` | Atualizar produto |
| DELETE | `/produtos/{id}` | Remover produto |


## Clientes

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/clientes` | Cadastrar cliente |
| GET | `/clientes` | Listar clientes |
| GET | `/clientes/{id}` | Buscar cliente |
| PUT | `/clientes/{id}` | Atualizar cliente |
| DELETE | `/clientes/{id}` | Remover cliente |

---

# 📄 Exemplo de requisição

## Cadastro de produto

```json
{
  "nome": "Notebook",
  "preco": 3500.00,
  "quantidadeEstoque": 10
}
```

## Resposta

```json
{
  "id": 1,
  "nome": "Notebook",
  "preco": 3500.00,
  "quantidadeEstoque": 10
}
```

---

# ▶️ Como executar o projeto

## Pré-requisitos

- Java 21
- PostgreSQL
- Git


## Clonar o projeto

```bash
git clone https://github.com/POLLY1515/Sistema-de-vendas.git
```

Acesse:

```bash
cd Sistema-de-vendas/backend
```

Configure o banco PostgreSQL e informe a variável:

```
DB_PASSWORD
```

Execute:

```bash
mvnw.cmd spring-boot:run
```

A aplicação estará disponível:

```
http://localhost:8080
```

---

# 📚 Conceitos aplicados

- Desenvolvimento de APIs REST
- Arquitetura em camadas
- Separação de responsabilidades
- DTOs para entrada e saída de dados
- Persistência utilizando JPA/Hibernate
- Validação de dados
- Regras de negócio
- Autenticação e autorização com JWT
- Controle de acesso por permissões

---

# 🔄 Próximas evoluções

- Integração com frontend utilizando Next.js
- Documentação da API com Swagger/OpenAPI
- Testes automatizados
- Melhorias de segurança
- Deploy da aplicação

---

# 👩‍💻 Desenvolvedora

**Poliana Amarante**

GitHub:
https://github.com/POLLY1515
