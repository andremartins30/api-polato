# 🚀 Studio API - Guia de Endpoints para Frontend

Documentação completa dos endpoints da Studio API para integração com frontend Next.js.

## 📡 Base URL
```
http://localhost:3001/api/v1
```

## 🔐 Autenticação

Todos os endpoints protegidos requerem o header:
```
Authorization: Bearer <jwt_token>
```

---

## 📝 **ENDPOINTS DE AUTENTICAÇÃO**

### 1. **POST** `/auth/register` - Cadastro de Usuário
**Público** | Cadastra um novo usuário no sistema

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "MinhaSenh@123"
}
```

**Validações:**
- `name`: 2-100 caracteres, obrigatório
- `email`: formato válido, obrigatório, único
- `password`: mínimo 6 caracteres, deve conter: 1 minúscula, 1 maiúscula, 1 número

**Response 201:**
```json
{
  "message": "Usuário criado com sucesso",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-v4",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "user",
    "isActive": true
  }
}
```

**Errors:**
- `409`: Email já cadastrado
- `400`: Dados inválidos

---

### 2. **POST** `/auth/login` - Login
**Público** | Autentica usuário existente

**Request Body:**
```json
{
  "email": "joao@email.com",
  "password": "MinhaSenh@123"
}
```

**Response 200:**
```json
{
  "message": "Login realizado com sucesso",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-v4",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "user",
    "isActive": true
  }
}
```

**Errors:**
- `401`: Credenciais inválidas
- `401`: Conta inativa

---

### 3. **GET** `/auth/profile` - Perfil do Usuário
**Protegido** | Retorna dados do usuário autenticado

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "message": "Perfil recuperado com sucesso",
  "user": {
    "id": "uuid-v4",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "user",
    "isActive": true,
    "lastLogin": "2025-07-15T21:00:00.000Z",
    "createdAt": "2025-07-15T20:00:00.000Z",
    "updatedAt": "2025-07-15T21:00:00.000Z"
  }
}
```

---

### 4. **POST** `/auth/refresh` - Renovar Token
**Protegido** | Gera um novo token JWT

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "message": "Token renovado com sucesso",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-v4",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "user",
    "isActive": true
  }
}
```

---

### 5. **POST** `/auth/logout` - Logout
**Protegido** | Realiza logout do usuário

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

## 👤 **ENDPOINTS DE USUÁRIO**

### 6. **PUT** `/users/profile` - Atualizar Perfil
**Protegido** | Atualiza dados do perfil do usuário

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "João Silva Santos",
  "email": "joao.santos@email.com"
}
```

**Response 200:**
```json
{
  "message": "Perfil atualizado com sucesso",
  "user": {
    "id": "uuid-v4",
    "name": "João Silva Santos",
    "email": "joao.santos@email.com",
    "role": "user",
    "isActive": true
  }
}
```

---

### 7. **PUT** `/users/password` - Alterar Senha
**Protegido** | Altera a senha do usuário

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "MinhaSenh@123",
  "newPassword": "NovaSenha@456"
}
```

**Response 200:**
```json
{
  "message": "Senha alterada com sucesso"
}
```

**Errors:**
- `401`: Senha atual incorreta

---

### 8. **DELETE** `/users/deactivate` - Desativar Conta
**Protegido** | Desativa a conta do usuário

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "message": "Conta desativada com sucesso"
}
```

---

## 👨‍💼 **ENDPOINTS ADMINISTRATIVOS**

### 9. **GET** `/users` - Listar Usuários
**Admin Only** | Lista todos os usuários do sistema

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)
- `search` (opcional): Busca por nome ou email

**Exemplo:**
```
GET /users?page=1&limit=5&search=joão
```

**Response 200:**
```json
{
  "message": "Usuários recuperados com sucesso",
  "users": [
    {
      "id": "uuid-v4",
      "name": "João Silva",
      "email": "joao@email.com",
      "role": "user",
      "isActive": true,
      "lastLogin": "2025-07-15T21:00:00.000Z",
      "createdAt": "2025-07-15T20:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

### 10. **GET** `/users/:id` - Buscar Usuário por ID
**Admin Only** | Retorna dados de um usuário específico

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response 200:**
```json
{
  "message": "Usuário encontrado",
  "user": {
    "id": "uuid-v4",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "user",
    "isActive": true,
    "lastLogin": "2025-07-15T21:00:00.000Z",
    "createdAt": "2025-07-15T20:00:00.000Z",
    "updatedAt": "2025-07-15T21:00:00.000Z"
  }
}
```

**Errors:**
- `404`: Usuário não encontrado

---

### 11. **DELETE** `/users/:id` - Excluir Usuário
**Admin Only** | Remove um usuário do sistema

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response 200:**
```json
{
  "message": "Usuário excluído com sucesso"
}
```

**Errors:**
- `404`: Usuário não encontrado

---

## 🚨 **CÓDIGOS DE ERRO COMUNS**

| Código | Significado | Quando Ocorre |
|--------|-------------|---------------|
| `400` | Bad Request | Dados inválidos no request |
| `401` | Unauthorized | Token inválido/expirado ou credenciais incorretas |
| `403` | Forbidden | Usuário sem permissão (não é admin) |
| `404` | Not Found | Recurso não encontrado |
| `409` | Conflict | Email já cadastrado |
| `429` | Too Many Requests | Rate limit excedido |
| `500` | Internal Server Error | Erro interno do servidor |

---

## 📱 **EXEMPLOS DE INTEGRAÇÃO - NEXT.JS**

### Hook de Autenticação (useAuth)
```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    loading: true
  });

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      setAuth({
        user: data.user,
        token: data.accessToken,
        loading: false
      });
      localStorage.setItem('token', data.accessToken);
      return data;
    }
    throw new Error('Login failed');
  };

  const logout = () => {
    setAuth({ user: null, token: null, loading: false });
    localStorage.removeItem('token');
  };

  return { ...auth, login, logout };
};
```

### Serviço de API
```typescript
// services/api.ts
const API_BASE = 'http://localhost:3001/api/v1';

class ApiService {
  private getHeaders(token?: string) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  async register(userData: { name: string; email: string; password: string }) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  }

  async getProfile(token: string) {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      headers: this.getHeaders(token)
    });
    
    if (!response.ok) throw new Error('Failed to get profile');
    return response.json();
  }

  async updateProfile(token: string, data: { name?: string; email?: string }) {
    const response = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  }
}

export const apiService = new ApiService();
```

### Middleware de Autenticação
```typescript
// middleware.ts (Next.js App Router)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  // Rotas protegidas
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Rotas de admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Aqui você pode decodificar o JWT para verificar o role
    // Por simplicidade, apenas verificamos se tem token
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};
```

---

## 🔧 **CONFIGURAÇÃO CORS**

A API está configurada para aceitar requisições de:
- `http://localhost:3000` (Next.js padrão)

Para adicionar outras origens, edite o arquivo `.env`:
```env
FRONTEND_URL=http://localhost:3000,https://meusite.com
```

---

## ⚡ **RATE LIMITING**

- **Limite:** 100 requisições por 15 minutos por IP
- **Headers de resposta:**
  - `RateLimit-Limit`: Limite total
  - `RateLimit-Remaining`: Requisições restantes
  - `RateLimit-Reset`: Tempo para reset (segundos)

---

## 🧪 **TESTANDO OS ENDPOINTS**

### Com cURL
```bash
# Cadastro
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"Test@123"}'

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123"}'

# Perfil (substitua TOKEN pelo token recebido)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3001/api/v1/auth/profile
```

### Com Postman/Insomnia
1. Importe a collection: [Download Collection](./postman-collection.json)
2. Configure a variável `{{baseUrl}}` como `http://localhost:3001/api/v1`
3. Após login, configure a variável `{{token}}` com o accessToken recebido

---

## 📞 **Suporte**

- **Servidor Health Check:** `GET /health`
- **Logs:** Verifique o console do servidor para debug
- **Banco de Dados:** PostgreSQL na porta 5432

---

> 💡 **Dica:** Salve o token JWT no localStorage/sessionStorage e inclua em todas as requisições protegidas. Tokens expiram em 7 dias.
