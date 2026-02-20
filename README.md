# Mini Sistema de Compras Online

Sistema desenvolvido como desafio técnico Full Stack, com integração de API externa, carrinho persistido em banco relacional e fluxo completo de criação e consulta de pedidos.

---

# ⚙️ Como Executar o Projeto

## 1. Clonar o repositório
```
git clone github.com/ElisonMartins/solucao-desafio-tecprime
cd solucao-desafio-tecprime
```
---

## 2. Subir o banco de dados (Docker)

Na pasta do backend:
```
docker compose up -d
```
Isso iniciará um container PostgreSQL.

Verifique se o container está rodando:
```
docker ps
```
---

## 3. Configurar variáveis de ambiente

Crie um arquivo .env na pasta backend baseado no .env.example:
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret_here
```
---

## 4. Criar estrutura do banco

Ainda na pasta backend:
```
npx prisma db push
npx prisma generate
```
---

## 5. Rodar o Backend
```
npm install
npm run dev
```
Backend disponível em:

http://localhost:3001

---

## 6. Rodar o Frontend

Na pasta do frontend:
```
npm install
npm run dev
```
Frontend disponível em:

http://localhost:3000

---

# Tecnologias Utilizadas

## Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Docker
- Swagger (Documentação da API)

## Frontend

- Next.js
- React
- TypeScript
- TailwindCSS

---

# Arquitetura

O backend foi organizado em camadas:

## routes
Definição dos endpoints.

## controller
Camada de entrada HTTP.

## service
Regras de negócio.

## prisma
Persistência de dados.

Separação clara de responsabilidades visando manutenção, organização e escalabilidade.

---

# Integração com API Externa

Os produtos são consumidos de uma API pública:

https://fakestoreapi.com

O backend expõe:

`
GET /api/products
`

Os dados são normalizados para o seguinte formato:

- id
- nome
- descrição
- preço (R$)
- estoque (simulado)
- imagem

Produtos não são persistidos no banco, pois são fornecidos por API externa.

---

# Carrinho

O carrinho é persistido em banco relacional e vinculado ao usuário autenticado.

## Endpoints
`
GET    /api/cart
`

`
POST   /api/cart/items
`

`
PATCH  /api/cart/items/:itemId
`

`
DELETE /api/cart/items/:itemId
`

## Funcionalidades

- Adicionar item ao carrinho
- Atualizar quantidade
- Remover item
- Listar carrinho
- Cálculo de total no frontend

O carrinho é criado automaticamente caso o usuário ainda não possua um.

---

# Pedido

## Estrutura relacional

- orders
- order_items

## Endpoints

`
POST /api/orders
`

`
GET  /api/orders/:id
`

O pedido salva snapshot de:

- productId
- price
- quantity

Garantindo integridade histórica mesmo que a API externa altere valores futuramente.

---

# Autenticação

Autenticação baseada em JWT.

Endpoints protegidos utilizam:

Authorization: Bearer <token>

---

# Decisões Técnicas

- Produtos não são persistidos no banco por serem fornecidos por API externa.
- O carrinho é persistido para permitir edição entre sessões.
- O pedido salva snapshot de preço para evitar inconsistências futuras.
- Separação clara de camadas para facilitar manutenção.
- Docker utilizado para padronização de ambiente.
- Swagger implementado para documentação e teste dos endpoints.

---

# Melhorias Futuras

- Controle transacional de estoque
- Testes automatizados (unitários e integração)
- Logs estruturados
- CI/CD
- Deploy em ambiente cloud
- Tratamento avançado de erros e validações
