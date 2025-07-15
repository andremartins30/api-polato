# 📚 Exemplos de Integração - Next.js

Este diretório contém exemplos práticos de como integrar a Studio API com Next.js.

## 📁 Estrutura dos Arquivos

```
examples/
├── api-service.ts          # Serviço principal da API
├── auth-hook.ts           # Hook de autenticação React
├── auth-provider.tsx      # Context Provider de autenticação
├── login-form.tsx         # Componente de login
├── middleware.ts          # Middleware Next.js
└── env-example.txt        # Exemplo de variáveis de ambiente
```

## 🚀 Como usar

1. **Copie os arquivos necessários** para seu projeto Next.js
2. **Configure as variáveis de ambiente** (.env.local)
3. **Instale as dependências** se necessário
4. **Implemente os componentes** em suas páginas

## 📋 Dependências Necessárias

```bash
npm install @types/node
```

## 🔧 Configuração Rápida

1. Copie `api-service.ts` para `lib/api.ts`
2. Copie `auth-provider.tsx` para `contexts/AuthContext.tsx`
3. Configure o middleware de autenticação
4. Use os hooks nos componentes

## 📝 Exemplo de Uso

```typescript
// pages/_app.tsx
import { AuthProvider } from '@/contexts/AuthContext';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
```

```typescript
// pages/dashboard.tsx
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <h1>Bem-vindo, {user?.name}!</h1>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```
