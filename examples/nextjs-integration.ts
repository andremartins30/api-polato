// lib/api.ts - Serviço de API para Next.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface ApiError {
  error: string;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
    value: any;
  }>;
}

class ApiService {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erro na API');
    }
    
    return data;
  }

  // Auth endpoints
  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    
    return this.handleResponse<AuthResponse>(response);
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });
    
    return this.handleResponse<AuthResponse>(response);
  }

  async getProfile(token: string): Promise<{ message: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: this.getHeaders(token),
    });
    
    return this.handleResponse(response);
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: this.getHeaders(token),
    });
    
    return this.handleResponse<AuthResponse>(response);
  }

  async logout(token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getHeaders(token),
    });
    
    return this.handleResponse(response);
  }

  // User endpoints
  async updateProfile(
    token: string,
    data: { name?: string; email?: string }
  ): Promise<{ message: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
    
    return this.handleResponse(response);
  }

  async changePassword(
    token: string,
    data: { currentPassword: string; newPassword: string }
  ): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/users/password`, {
      method: 'PUT',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
    
    return this.handleResponse(response);
  }

  async deactivateAccount(token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/users/deactivate`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });
    
    return this.handleResponse(response);
  }

  // Admin endpoints
  async getAllUsers(
    token: string,
    params?: { page?: number; limit?: number; search?: string }
  ): Promise<{
    message: string;
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    
    const url = `${API_BASE_URL}/users${searchParams.toString() ? `?${searchParams}` : ''}`;
    
    const response = await fetch(url, {
      headers: this.getHeaders(token),
    });
    
    return this.handleResponse(response);
  }

  async getUserById(token: string, id: string): Promise<{ message: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: this.getHeaders(token),
    });
    
    return this.handleResponse(response);
  }

  async deleteUser(token: string, id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });
    
    return this.handleResponse(response);
  }

  // Health check
  async healthCheck(): Promise<{
    status: string;
    message: string;
    timestamp: string;
    version: string;
  }> {
    const response = await fetch(`http://localhost:3001/health`);
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();

// hooks/useAuth.ts - Hook de autenticação para Next.js
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiService, User, AuthResponse } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar token salvo ao carregar a página
    const savedToken = localStorage.getItem('studio_token');
    if (savedToken) {
      setToken(savedToken);
      loadUserProfile(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserProfile = async (authToken: string) => {
    try {
      const response = await apiService.getProfile(authToken);
      setUser(response.user);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      setUser(response.user);
      setToken(response.accessToken);
      localStorage.setItem('studio_token', response.accessToken);
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await apiService.register({ name, email, password });
      setUser(response.user);
      setToken(response.accessToken);
      localStorage.setItem('studio_token', response.accessToken);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('studio_token');
  };

  const updateProfile = async (data: { name?: string; email?: string }) => {
    if (!token) throw new Error('Não autenticado');
    
    try {
      const response = await apiService.updateProfile(token, data);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// components/LoginForm.tsx - Componente de exemplo
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div>
        <label htmlFor="password">Senha:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}

// middleware.ts - Middleware de autenticação para Next.js
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('studio_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  // Rotas protegidas
  const protectedRoutes = ['/dashboard', '/profile'];
  const adminRoutes = ['/admin'];
  const publicRoutes = ['/login', '/register', '/'];

  const { pathname } = request.nextUrl;

  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Redirecionar para login se não tiver token em rota protegida
  if ((isProtectedRoute || isAdminRoute) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se tem token e tenta acessar rotas públicas, redirecionar para dashboard
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/profile/:path*',
    '/login',
    '/register'
  ]
};

// .env.local - Variáveis de ambiente para Next.js
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
