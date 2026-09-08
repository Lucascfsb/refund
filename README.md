# Refund API

API REST para gerenciamento de solicitações de reembolso, usuários e comprovantes de despesas.

## Tecnologias

- Node.js
- TypeScript
- Express 5
- Prisma ORM 7
- SQLite
- JWT
- Zod
- Multer
- bcrypt
- better-sqlite3

## Funcionalidades

- Cadastro de usuários
- Autenticação com JWT
- Controle de acesso por função:
  - `employee`
  - `manager`
- Upload de comprovantes
- Criação e consulta de reembolsos
- Paginação e filtro por nome do usuário
- Validação de dados com Zod
- Armazenamento local de arquivos

## Pré-requisitos

- Node.js 20 ou superior
- npm

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/refund-api.git
cd refund-api
npm install
```

Execute as migrações do banco:

```bash
npx prisma migrate deploy
```

Gere o Prisma Client:

```bash
npx prisma generate
```

Inicie a aplicação em modo de desenvolvimento:

```bash
npm run dev
```

A API estará disponível em:

```text
http://localhost:3333
```

## Scripts disponíveis

```bash
npm run dev       # Inicia o servidor em modo watch
npm run build     # Compila o projeto TypeScript
npm start         # Inicia a aplicação compilada
```

Comandos úteis do Prisma:

```bash
npx prisma studio
npx prisma migrate dev
npx prisma generate
```

## Banco de dados

O projeto utiliza SQLite através do Prisma.

O banco local fica no arquivo:

```text
dev.db
```

As tabelas principais são:

- `users`
- `refunds`

## Autenticação

As rotas privadas exigem um token JWT no cabeçalho:

```http
Authorization: Bearer SEU_TOKEN
```

O token é obtido através da rota de sessão:

```http
POST /sessions
```

## Endpoints

### Usuários

#### Criar usuário

```http
POST /users
```

Corpo da requisição:

```json
{
  "name": "Lucas Castro",
  "email": "lucas@email.com",
  "password": "123456",
  "role": "manager"
}
```

```json
{
  "name": "Clara Castro",
  "email": "lucas@email.com",
  "password": "123456",
  "role": "employee"
}
```

Valores aceitos para `role`:

- `employee`
- `manager`

Resposta:

```http
201 Created
```

### Sessões

#### Autenticar usuário

```http
POST /sessions
```

Corpo da requisição:

```json
{
  "email": "lucas@email.com",
  "password": "123456"
}
```

Resposta:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "name": "Lucas Castro",
    "email": "lucas@email.com",
    "role": "employee",
    "createdAt": "2026-09-07T00:00:00.000Z",
    "updatedAt": null
  }
}
```

### Uploads

As rotas de upload exigem autenticação e estão disponíveis apenas para usuários `employee`.

#### Enviar comprovante

```http
POST /uploads
```

Content-Type:

```http
multipart/form-data
```

Campo do arquivo:

```text
file
```

Tipos aceitos:

- JPEG
- JPG
- PNG

Tamanho máximo:

```text
3 MB
```

Resposta:

```json
{
  "filename": "arquivo-gerado.png"
}
```

Os arquivos enviados podem ser acessados através de:

```text
GET /uploads/:filename
```

### Reembolsos

#### Criar reembolso

Disponível para usuários `employee`.

```http
POST /refunds
```

Corpo da requisição:

```json
{
  "name": "Almoço com cliente",
  "amount": 85.5,
  "category": "food",
  "filename": "arquivo-gerado.png"
}
```

Categorias disponíveis:

- `food`
- `other`
- `services`
- `transport`
- `accommodation`

#### Listar reembolsos

Disponível para usuários `manager`.

```http
GET /refunds
```

Parâmetros opcionais:

```text
name
page
perPage
```

Exemplo:

```http
GET /refunds?name=Lucas&page=1&perPage=10
```

Resposta:

```json
{
  "refunds": [],
  "pagination": {
    "totalRecords": 0,
    "totalPages": 1,
    "page": 1,
    "perPage": 10
  }
}
```

#### Consultar um reembolso

Disponível para usuários `employee` e `manager`.

```http
GET /refunds/:id
```

Exemplo:

```http
GET /refunds/5f8c2c7b-3c3e-4f6d-bc1a-123456789abc
```

## Estrutura do projeto

```text
src/
├── configs/          # Configurações de autenticação e upload
├── controllers/      # Regras de entrada e saída das requisições
├── database/         # Configuração do Prisma
├── generated/        # Prisma Client gerado
├── middlewares/      # Autenticação, autorização e tratamento de erros
├── providers/        # Serviços de armazenamento
├── routes/           # Definição das rotas da API
├── types/            # Tipos e extensões do Express
└── utils/            # Utilitários e erros personalizados

prisma/
├── migrations/       # Migrações do banco de dados
└── schema.prisma     # Modelo de dados
```

## Tratamento de erros

Erros de validação retornam status `400`:

```json
{
  "message": "Validation error",
  "issues": {}
}
```

Erros da aplicação retornam uma mensagem personalizada:

```json
{
  "message": "Unauthorized"
}
```

## Segurança

Antes de publicar a aplicação em produção:

- Utilize uma chave JWT armazenada em variável de ambiente.
- Não compartilhe o arquivo `dev.db` caso ele contenha dados reais.
- Configure um serviço de armazenamento externo para os uploads.
- Utilize HTTPS.
- Configure CORS de acordo com os domínios permitidos.
- Evite permitir que usuários definam livremente funções administrativas no cadastro.

## Licença

Este projeto está sob a licença ISC.
