# PRD - Cardápio Digital

## Resumo

Criar um cardápio digital completo com backend em Spring Boot e frontend em HTML/CSS/JavaScript puro. A solução deve incluir API REST, documentação Swagger, persistência com H2/JPA, categorias, carrinho e pedido.

## Problema

Restaurantes precisam de um cardápio digital simples para listar produtos, organizar categorias e receber pedidos de forma leve e responsiva.

## Público-Alvo

- Donos de restaurantes pequenos
- Usuários que fazem pedidos via navegador
- Equipe de desenvolvimento para manutenção do backend e frontend

## Objetivos do produto

- Exibir lista de produtos com imagem, preço, categoria e descrição
- Filtrar produtos por categoria
- Permitir adicionar itens a um carrinho
- Finalizar pedido com total calculado
- Documentar API com Swagger
- Persistir dados de produtos, categorias, pedidos e itens do pedido

## Requisitos

### Funcionais

- cadastrar produto
- listar produtos
- editar produto
- remover produto
- listar categorias
- criar pedido
- listar pedidos
- calcular valor total do pedido
- interface responsiva com carrinho e finalização

### Não-funcionais

- usar Java 21 e Spring Boot 3.x
- usar Maven
- usar Spring Data JPA + H2
- frontend sem frameworks
- documentação OpenAPI/Swagger
- histórico Git com Conventional Commits

## Regras de negócio

- Produto deve conter nome, descrição, preço, categoria, imagem e disponibilidade
- Pedido deve armazenar itens do pedido com quantidade e valor total
- Categorias devem ser persistidas e apresentadas ao frontend

## Métricas de sucesso

- backend compilando e rodando com Maven
- frontend exibindo produtos e carrinho
- Swagger acessível em `/swagger-ui.html`
- H2 Console acessível em `/h2-console`
- pedidos sendo persistidos em memória H2
