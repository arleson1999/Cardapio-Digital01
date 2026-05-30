# Cardápio Digital

## Visão geral

Cardápio Digital é uma aplicação SaaS de vendas para restaurantes e comércios locais. Ela oferece um backend REST em Java/Spring Boot e um frontend leve em HTML/CSS/JavaScript, permitindo exibir itens do cardápio, filtrar por categorias, gerenciar carrinho e registrar pedidos.

## Funcionalidades principais

- Listagem de produtos por categorias
- Exibição de nome, descrição, preço e imagem
- Filtro de categorias (bebidas, lanches, sobremesas, combos)
- Carrinho de compras e finalização de pedido
- Persistência de produtos, categorias, pedidos e itens de pedido via JPA e H2
- Documentação Swagger/OpenAPI disponível para consumo da API
- Console H2 para inspeção da base em tempo de execução

## Tecnologias utilizadas

- Java 21
- Spring Boot 3.x
- Maven
- Spring Data JPA
- H2 Database
- Springdoc OpenAPI (Swagger)
- HTML, CSS e JavaScript puro

## Como executar

1. Abra o projeto em sua IDE favorita ou terminal.
2. No diretório raiz do projeto, execute:

```bash
mvn spring-boot:run
```

3. Aguarde a aplicação iniciar e acesse:

- Frontend: `http://localhost:8080/`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- H2 Console: `http://localhost:8080/h2-console`

## Endpoints principais

### Produtos

- `GET /api/produtos`
- `POST /api/produtos`
- `PUT /api/produtos/{id}`
- `DELETE /api/produtos/{id}`

### Categorias

- `GET /api/categorias`

### Pedidos

- `GET /api/pedidos`
- `POST /api/pedidos`

## Acesso ao H2 Console

- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- User Name: `sa`
- Password: (deixe em branco)

## Estrutura do projeto

- `backend/` – código Java do serviço REST
- `frontend/` – interface web em HTML/CSS/JS
- `docs/` – documentação do produto, plano, decisões e histórico de agentes

## Como a IA foi utilizada

- Suporte na organização do projeto e geração de documentação técnica
- Criação de APIs REST e estruturação das camadas de serviço
- Criação do frontend responsivo e integração com o backend
- Revisão das regras de negócio e contratos de API

## Observações

- A base H2 é em memória; dados são recriados a cada reinício.
- O frontend consome a API JSON fornecida pelo backend.
- O projeto segue convenções REST, uso de DTOs e separação clara entre controller, service e repository.
