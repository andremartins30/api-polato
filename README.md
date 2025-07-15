# Studio API

API backend desenvolvida em Node.js com Express, PostgreSQL e JWT para autenticação de usuários.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **Sequelize** - ORM para PostgreSQL
- **JWT** - Autenticação por tokens
- **bcryptjs** - Hash de senhas
- **Helmet** - Segurança HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Rate Limiting** - Limitação de requisições

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- PostgreSQL (v12 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd studio-api
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas configurações:
```env
# Configuração do Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=studio_api_db
DB_USER=postgres
DB_PASSWORD=sua-senha-do-postgres

# JWT
JWT_SECRET=sua-chave-secreta-jwt-super-segura

# Outras configurações...
```

5. Crie o banco de dados no PostgreSQL
```sql
CREATE DATABASE studio_api_db;
```

6. Execute a aplicação
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📚 Endpoints da API

### Autenticação

#### POST `/api/v1/auth/register`
Cadastra um novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "MinhaSenh@123"
}
```

**Response:**
```json
{
  "message": "Usuário criado com sucesso",
  "accessToken": "jwt-token",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "user",
    "isActive": true
  }
}
```

#### POST `/api/v1/auth/login`
Realiza login do usuário.

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "MinhaSenh@123"
}
```

**Response:**
```json
{
  "message": "Login realizado com sucesso",
  "accessToken": "jwt-token",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "user",
    "isActive": true
  }
}
```

#### GET `/api/v1/auth/profile`
Retorna o perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Perfil recuperado com sucesso",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "user",
    "isActive": true,
    "lastLogin": "2025-07-15T10:30:00.000Z",
    "createdAt": "2025-07-15T10:00:00.000Z",
    "updatedAt": "2025-07-15T10:30:00.000Z"
  }
}
```

### Usuários

#### PUT `/api/v1/users/profile`
Atualiza o perfil do usuário.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "João Silva Santos",
  "email": "joao.santos@email.com"
}
```

#### PUT `/api/v1/users/password`
Altera a senha do usuário.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "currentPassword": "MinhaSenh@123",
  "newPassword": "NovaSenha@456"
}
```

#### GET `/api/v1/users` (Admin only)
Lista todos os usuários.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `page` - Página (padrão: 1)
- `limit` - Itens por página (padrão: 10)
- `search` - Busca por nome ou email

#### DELETE `/api/v1/users/:id` (Admin only)
Exclui um usuário.

**Headers:**
```
Authorization: Bearer <admin-token>
```

## 🔒 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Inclua o token no header `Authorization` como `Bearer <token>`.

## 👥 Roles

- **user** - Usuário comum
- **admin** - Administrador com acesso a todas as funcionalidades

## 🛡️ Segurança

- Passwords são hasheadas com bcrypt (salt rounds: 12)
- Rate limiting implementado
- Headers de segurança com Helmet
- Validação de entrada com express-validator
- CORS configurado

## 🗃️ Estrutura do Projeto

```
src/
├── config/          # Configurações (database, etc.)
├── controllers/     # Controladores das rotas
├── middleware/      # Middlewares (auth, validation, etc.)
├── models/          # Modelos do Sequelize
├── routes/          # Definição das rotas
├── utils/           # Utilitários (JWT, etc.)
└── server.js        # Arquivo principal
```

## 🐛 Troubleshooting

### Erro de conexão com PostgreSQL
1. Verifique se o PostgreSQL está rodando
2. Confirme as credenciais no arquivo `.env`
3. Certifique-se de que o banco de dados existe

### Token expirado
- Os tokens JWT expiram em 7 dias por padrão
- Use o endpoint `/api/v1/auth/refresh` para renovar

## 📄 Licença

Este projeto está sob a licença ISC.
