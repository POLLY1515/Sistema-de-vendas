# 🛒 Sistema de Vendas API

API REST backend desenvolvida em **Java 21 com Spring Boot** para gerenciamento de operações comerciais.

O projeto implementa uma aplicação de vendas com gerenciamento de usuários, clientes, produtos e pedidos, aplicando conceitos utilizados no desenvolvimento de APIs profissionais, como **arquitetura em camadas, persistência de dados, DTOs, validação, autenticação JWT e controle de acesso por perfil de usuário**.

---

## ⭐ Principais recursos

🔐 **Autenticação stateless com JWT**

👥 **Controle de acesso por perfis ADMIN e VENDEDOR**

📦 **Gerenciamento de produtos**

👤 **Gerenciamento de clientes**

🛒 **Operações relacionadas a pedidos e vendas**

🐘 **Persistência de dados com PostgreSQL**

✅ **Validação de dados com Bean Validation**

🏗️ **Arquitetura em camadas: Controller → Service → Repository**

🔄 **DTOs para entrada e saída de dados**

🌐 **CORS configurado para integração com frontend**

---

# 🚀 Objetivo

Construir uma **API REST para gerenciamento de operações comerciais**, aplicando práticas utilizadas no desenvolvimento de sistemas backend.

O projeto foi desenvolvido com foco em:

* organização e separação de responsabilidades;
* criação de endpoints REST;
* persistência de dados;
* aplicação de regras de negócio;
* validação de dados;
* autenticação e autorização;
* segurança utilizando JWT;
* integração futura com aplicações frontend.

---

# 🛠️ Tecnologias utilizadas

* **Java 21**
* **Spring Boot**
* **Spring Security**
* **JWT — JSON Web Token**
* **Spring Data JPA**
* **Hibernate**
* **PostgreSQL**
* **Maven**
* **Lombok**
* **Bean Validation**
* **Git**
* **GitHub**

---

# 🏗️ Arquitetura

A aplicação utiliza uma **arquitetura em camadas**, mantendo responsabilidades separadas entre os componentes do sistema.

```text
        Requisição HTTP
              │
              ▼
         Controller
              │
              ▼
           Service
              │
              ▼
         Repository
              │
              ▼
      PostgreSQL Database
```

## 📂 Responsabilidade das camadas

### Controller

Responsável por receber as requisições HTTP e disponibilizar os endpoints da API.

Principais responsabilidades:

* receber requisições;
* receber dados enviados pelo cliente;
* acionar a camada de serviço;
* retornar respostas HTTP;
* trabalhar com DTOs de entrada e saída.

---

### Service

Responsável pelas regras de negócio da aplicação.

Principais responsabilidades:

* processamento das operações;
* aplicação das regras de negócio;
* validações relacionadas ao domínio;
* comunicação entre Controller e Repository;
* conversão entre entidades e DTOs quando necessário.

---

### Repository

Responsável pela comunicação com o banco de dados utilizando **Spring Data JPA**.

Essa camada executa operações de:

* consulta;
* persistência;
* atualização;
* exclusão de dados.

---

### Entity

Representa as entidades persistidas no banco de dados PostgreSQL.

As entidades são utilizadas pelo JPA/Hibernate para realizar o mapeamento entre objetos Java e tabelas do banco.

---

### DTO

Os **Data Transfer Objects** são utilizados para transportar dados entre a API e o cliente.

Essa abordagem evita a exposição direta das entidades da aplicação e permite controlar quais informações são recebidas e retornadas pelos endpoints.

---

# 🔐 Segurança

A aplicação utiliza **Spring Security** com autenticação baseada em **JWT — JSON Web Token**.

O sistema possui:

* autenticação de usuários;
* geração de token JWT;
* validação do token;
* proteção de endpoints;
* controle de acesso;
* autenticação stateless;
* autorização baseada no perfil do usuário.

---

## 👥 Perfis de acesso

Atualmente a aplicação trabalha com dois perfis:

### ADMIN

Perfil destinado às operações administrativas permitidas pela aplicação.

### VENDEDOR

Perfil destinado às operações comerciais e consultas autorizadas ao vendedor.

As permissões são controladas pelo backend através do **Spring Security**.

---

# 🔑 Fluxo de autenticação

O usuário realiza o login enviando suas credenciais para:

```http
POST /auth/login
```

Exemplo:

```json
{
  "email": "usuario@email.com",
  "senha": "123456"
}
```

Após a autenticação, a API retorna um **token JWT**.

Exemplo simplificado:

```json
{
  "token": "eyJhbGciOiJIUzM4NCJ9...",
  "tipo": "Bearer"
}
```

Nas próximas requisições para endpoints protegidos, o token deve ser enviado no header:

```http
Authorization: Bearer SEU_TOKEN
```

Exemplo:

```http
GET /produtos
Authorization: Bearer eyJhbGciOiJIUzM4NCJ9...
```

O backend valida o token antes de permitir o acesso ao recurso solicitado.

---

# 🌐 CORS

A API possui configuração de **CORS** para permitir a integração com o frontend durante o ambiente de desenvolvimento.

Frontend autorizado atualmente:

```text
http://localhost:3000
```

A configuração permite o envio do header:

```http
Authorization
```

necessário para autenticação através do token JWT.

Também estão previstos os principais métodos HTTP utilizados pela aplicação:

```text
GET
POST
PUT
PATCH
DELETE
OPTIONS
```

Essa configuração permitirá a comunicação entre o backend Spring Boot e o frontend desenvolvido em Next.js.

---

# ✅ Funcionalidades implementadas

## 👥 Usuários

✔ Cadastro de usuários

✔ Autenticação através de login

✔ Geração de token JWT

✔ Controle de acesso por perfil

✔ Perfis ADMIN e VENDEDOR

---

## 👤 Clientes

✔ Cadastro de clientes

✔ Listagem de clientes

✔ Busca por ID

✔ Atualização de dados

✔ Exclusão

---

## 📦 Produtos

✔ Cadastro de produtos

✔ Listagem de produtos

✔ Busca por ID

✔ Atualização de dados

✔ Exclusão

✔ Controle de quantidade em estoque

---

## 🛒 Pedidos

✔ Consulta de pedidos

✔ Gerenciamento de operações relacionadas às vendas

✔ Integração das operações comerciais com os recursos da aplicação

---

# 📌 Endpoints principais

## 🔐 Autenticação

| Método | Endpoint      | Descrição                            |
| ------ | ------------- | ------------------------------------ |
| `POST` | `/auth/login` | Autenticar usuário e gerar token JWT |

---

## 📦 Produtos

| Método   | Endpoint         | Descrição             |
| -------- | ---------------- | --------------------- |
| `POST`   | `/produtos`      | Cadastrar produto     |
| `GET`    | `/produtos`      | Listar produtos       |
| `GET`    | `/produtos/{id}` | Buscar produto por ID |
| `PUT`    | `/produtos/{id}` | Atualizar produto     |
| `DELETE` | `/produtos/{id}` | Remover produto       |

---

## 👤 Clientes

| Método   | Endpoint         | Descrição             |
| -------- | ---------------- | --------------------- |
| `POST`   | `/clientes`      | Cadastrar cliente     |
| `GET`    | `/clientes`      | Listar clientes       |
| `GET`    | `/clientes/{id}` | Buscar cliente por ID |
| `PUT`    | `/clientes/{id}` | Atualizar cliente     |
| `DELETE` | `/clientes/{id}` | Remover cliente       |

---

# 📄 Exemplos de utilização

## Cadastrar produto

### Requisição

```http
POST /produtos
Authorization: Bearer SEU_TOKEN
Content-Type: application/json
```

### Body

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

---

## Listar produtos

### Requisição

```http
GET /produtos
Authorization: Bearer SEU_TOKEN
```

A API valida o JWT e, caso o usuário possua acesso ao recurso, retorna os produtos cadastrados.

---

# ▶️ Como executar o projeto

## Pré-requisitos

Antes de iniciar a aplicação, tenha instalado:

* Java 21
* PostgreSQL
* Git

O projeto utiliza o **Maven Wrapper**, portanto não é obrigatório possuir o Maven instalado globalmente.

---

## 1. Clonar o repositório

```bash
git clone https://github.com/POLLY1515/Sistema-de-vendas.git
```

---

## 2. Acessar o projeto

```bash
cd Sistema-de-vendas/backend
```

---

## 3. Configurar o PostgreSQL

Configure o banco PostgreSQL utilizado pela aplicação.

A senha do banco deve ser informada através da variável:

```text
DB_PASSWORD
```

Credenciais e informações sensíveis não devem ser armazenadas diretamente no repositório.

---

## 4. Executar no Windows

```bash
mvnw.cmd spring-boot:run
```

---

## 5. Executar no Linux ou macOS

```bash
./mvnw spring-boot:run
```

---

## 6. Acessar a aplicação

Após a inicialização, a API estará disponível em:

```text
http://localhost:8080
```

---

# 🧪 Testando a API

A API pode ser testada utilizando ferramentas como **Postman**.

Fluxo recomendado:

```text
1. Realizar login
        ↓
2. Receber o token JWT
        ↓
3. Enviar o token no header Authorization
        ↓
4. Acessar os endpoints protegidos
```

Exemplo:

```http
Authorization: Bearer SEU_TOKEN
```

---

# 📚 Conceitos aplicados

Durante o desenvolvimento deste projeto foram aplicados conceitos importantes de desenvolvimento backend:

* desenvolvimento de APIs REST;
* arquitetura em camadas;
* separação de responsabilidades;
* orientação a objetos;
* DTOs para entrada e saída de dados;
* persistência utilizando JPA/Hibernate;
* relacionamento entre entidades;
* validação de dados;
* regras de negócio;
* tratamento de requisições HTTP;
* autenticação com JWT;
* autorização com Spring Security;
* controle de acesso por perfil;
* integração com PostgreSQL;
* configuração de CORS;
* utilização do Maven;
* versionamento com Git e GitHub.

---

# 🔄 Próximas evoluções

O projeto continuará evoluindo com a implementação de novos recursos.

Próximas etapas:

* 🔗 Integração com frontend utilizando **Next.js**
* 📖 Documentação interativa utilizando **Swagger / OpenAPI**
* 🧪 Implementação de **testes automatizados**
* 🔐 Melhorias adicionais de segurança
* 🌐 Deploy da aplicação
* 📊 Evolução das funcionalidades relacionadas a pedidos e vendas

---

# 📈 Status do projeto

🚧 **Em desenvolvimento**

O backend principal já possui recursos de autenticação, segurança, clientes, produtos e operações comerciais.

A próxima etapa é realizar a integração da API com uma aplicação frontend desenvolvida em **Next.js**.

---

# 👩‍💻 Desenvolvedora

**Poliana Amarante**

Desenvolvedora Java Backend

GitHub:
https://github.com/POLLY1515
