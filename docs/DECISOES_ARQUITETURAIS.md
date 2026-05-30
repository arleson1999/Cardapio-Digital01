# DECISOES_ARQUITETURAIS

## 1. Estrutura de projeto

Optou-se por separar o backend em um módulo `backend/` e manter o frontend como fonte estática em `frontend/`. A documentação fica em `docs/`.

## 2. Camadas do backend

- `controller/` para endpoints REST
- `service/` para lógica de negócio
- `repository/` para acesso JPA
- `dto/` para transferir dados entre API e serviço
- `entity/` para classes persistentes

## 3. Persistência

O projeto usa H2 em memória via Spring Data JPA. O H2 Console foi habilitado para inspeção.

## 4. Documentação API

Springdoc OpenAPI oferece Swagger UI em `/swagger-ui.html`.

## 5. Frontend

Frontend em HTML/CSS/JS puro, sem frameworks, consumindo API JSON.
