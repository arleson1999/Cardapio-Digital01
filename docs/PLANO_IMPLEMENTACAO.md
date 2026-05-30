# PLANO_IMPLEMENTACAO

## Objetivo

Planejar a implementação de um cardápio digital com backend Spring Boot, frontend puro e documentação completa.

## Escopo

- Backend: API REST, entidades, serviço, repositórios, validação, Swagger, H2
- Frontend: listagem de produtos, categorias, carrinho, finalização
- Documentação: PRD, decisões arquiteturais, prompts, relatório de agentes, regras do cursor

## Passos

1. Reorganizar o projeto para `backend/`, `frontend/`, `docs/`
2. Criar backend Maven module com Spring Boot e H2
3. Implementar entidade Produto com campos obrigatórios
4. Implementar entidade Categoria e persistência
5. Implementar entidade Pedido e itens de pedido
6. Criar serviço `ProductService` e `OrderService`
7. Criar `ProductController` e `OrderController`
8. Expor endpoints REST em `/api/produtos`, `/api/pedidos`, `/api/categorias`
9. Configurar Swagger e H2 Console
10. Copiar frontend para `frontend/` e manter arquivos estáticos em backend
11. Ajustar frontend para consumir os endpoints do backend
12. Criar documentação obrigatória e atualizar README

## Critérios de aceitação

- `backend/pom.xml` deve compilar
- `backend` deve executar com `mvn spring-boot:run`
- Swagger disponível em `/swagger-ui.html`
- H2 Console disponível em `/h2-console`
- Frontend exibindo produtos, carrinho e finalização
- arquivos de documento existentes em `docs/`
