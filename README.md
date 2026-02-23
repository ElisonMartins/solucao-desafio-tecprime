# Mini Sistema de Compras Online

Sistema desenvolvido como desafio técnico Full Stack, com integração de API externa, carrinho persistido em banco relacional, controle transacional de estoque, autenticação JWT, testes automatizados e logs estruturados.

O projeto simula um fluxo real de e-commerce, incluindo:

- Autenticação de usuários
- Carrinho persistido
- Sincronização e normalização de produtos externos
- Criação de pedidos com snapshot de preço
- Consulta de pedidos
- Controle transacional de estoque

---

# Como Executar o Projeto

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
```
http://localhost:3001
```
Documentação Swagger:
```
http://localhost:3001/docs
```
---

## 6. Rodar o Frontend

Na pasta do frontend:
```
npm install
npm run dev
```
Frontend disponível em:
```
http://localhost:3000
```
---

# Testes Automatizados

Foram implementados testes unitários para as regras críticas do Order Service.

Para executar:
```
npm test
```
Cenários cobertos:

- Produto inexistente
- Estoque insuficiente
- Criação de pedido com sucesso
- Consulta de pedido existente
- Erro ao consultar pedido inexistente

---

# Logs Estruturados

O backend utiliza Pino para logs estruturados.

- Logs informativos (info)
- Logs de aviso (warn)
- Logs de erro (error)
- Contexto estruturado (userId, productId, etc.)

Os logs são exibidos no terminal durante a execução da aplicação.

---

# Tecnologias Utilizadas

## Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Docker
- Zod (validação de dados)
- Pino (logs estruturados)
- Jest (testes automatizados)
- Swagger (documentação da API)

## Frontend

- Next.js
- React
- TypeScript
- TailwindCSS

---

# Arquitetura

O backend foi organizado em camadas:

- routes: definição dos endpoints
- controllers: camada HTTP (request/response)
- services: regras de negócio
- integrations: comunicação com APIs externas
- prisma: persistência de dados

Separação clara de responsabilidades visando manutenção, organização e escalabilidade.

### Decisão Arquitetural

Optei por não criar uma camada Repository separada, pois:

- O projeto possui escopo reduzido.
- As consultas ao banco são simples e diretas.
- O Prisma já abstrai a camada de acesso a dados.
- Não há múltiplas fontes de dados ou necessidade de troca de banco.

Essa decisão foi tomada visando simplicidade, clareza e adequação ao escopo do desafio, evitando overengineering.

---

# Integração com API Externa

Os produtos são consumidos da API pública:
```
https://fakestoreapi.com
```
Na primeira execução, os produtos são:

- Consumidos da API
- Normalizados
- Convertidos para Real (R$)
- Persistidos no banco com estoque inicial fixo

A sincronização evita múltiplas chamadas externas desnecessárias.

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

`
DELETE /api/cart/clear
`

## Funcionalidades

- Listar carrinho do usuário autenticado
- Adicionar item ao carrinho
- Atualizar quantidade de um item
- Remover item do carrinho
- Remover todos os itens do carrinho

O carrinho é criado automaticamente durante o registro do usuário.

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

Garantindo integridade histórica mesmo que valores futuros sejam alterados.

O processo de criação do pedido utiliza prisma.$transaction para:

- Validar estoque
- Atualizar estoque
- Criar pedido
- Criar itens do pedido

Garantindo integridade mesmo em caso de erro durante a operação.

---
# Autenticação

Autenticação baseada em JWT.

## Endpoints

`
POST   /api/auth/register 
`

`
POST   /api/auth/login 
`

## Funcionamento

- Cria usuário e carrinho automaticamente.
- Login valida credenciais e gera token JWT com validade de 1 dia.

Endpoints protegidos exigem header:
`
Authorization: Bearer <token>
`

---

# Script de Reset de Estoque

Foi implementado script utilitário para resetar estoque:
```
npm run reset:stock
```
---

# Diferenciais Implementados

- Controle transacional de estoque com prisma.$transaction
- Persistência do carrinho em banco relacional
- Snapshot de preço no pedido
- Testes unitários para regras críticas
- Logs estruturados com Pino
- Validação de dados com Zod
- Organização em camadas (controllers, services, integrations)
- Docker para padronização de ambiente
- Swagger para documentação e teste dos endpoints

---

# Decisões Técnicas

- O carrinho foi persistido no banco para aproximar o projeto de um cenário real de e-commerce.
- Snapshot de preço foi implementado para evitar inconsistências futuras.
- Controle transacional foi aplicado para garantir integridade de estoque.
- Separação clara de camadas para facilitar manutenção e escalabilidade.
- Prisma foi utilizado como ORM para simplificar o acesso ao banco.
- Docker foi utilizado para padronização do ambiente.
- Swagger foi implementado para facilitar testes e documentação.

---

# Melhorias Futuras

- Testes de integração
- Pipeline CI/CD
- Deploy em ambiente cloud
- Monitoramento centralizado de logs
- Rate limiting e proteção contra brute force
- Cache para produtos

---

# Considerações Finais

O projeto foi desenvolvido buscando:

- Simplicidade
- Clareza arquitetural
- Boas práticas de backend
- Separação de responsabilidades
- Aproximação de um cenário real de produção
