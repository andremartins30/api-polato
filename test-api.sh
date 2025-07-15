#!/bin/bash

# Studio API Test Script
# Este script testa todas as rotas da API

API_URL="http://localhost:3001/api/v1"
TOKEN=""

echo "🚀 Testando Studio API..."
echo "================================="

# Função para testar endpoints
test_endpoint() {
    echo -e "\n📍 Testando: $1"
    echo "Comando: $2"
    echo "Resposta:"
    eval $2
    echo -e "\n---"
}

# 1. Health Check
test_endpoint "Health Check" "curl -s $API_URL/../health | jq ."

# 2. Cadastro de usuário (caso não tenha sido feito)
echo -e "\n📝 Cadastrando usuário de teste..."
REGISTER_RESPONSE=$(curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria@teste.com",
    "password": "MinhaSenh@456"
  }')
echo $REGISTER_RESPONSE | jq .

# 3. Login e captura do token
echo -e "\n🔐 Fazendo login..."
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "MinhaSenh@123"
  }')

echo $LOGIN_RESPONSE | jq .

# Extrair token da resposta
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')
echo "Token capturado: ${TOKEN:0:50}..."

# 4. Testar rotas protegidas
echo -e "\n🔒 Testando rotas protegidas..."

# Profile
test_endpoint "GET Profile" "curl -s $API_URL/auth/profile -H 'Authorization: Bearer $TOKEN' | jq ."

# Refresh Token
test_endpoint "POST Refresh Token" "curl -s -X POST $API_URL/auth/refresh -H 'Authorization: Bearer $TOKEN' | jq ."

# Update Profile
test_endpoint "PUT Update Profile" "curl -s -X PUT $API_URL/users/profile \
  -H 'Authorization: Bearer $TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{\"name\": \"João Silva Santos\"}' | jq ."

# Change Password
test_endpoint "PUT Change Password" "curl -s -X PUT $API_URL/users/password \
  -H 'Authorization: Bearer $TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    \"currentPassword\": \"MinhaSenh@123\",
    \"newPassword\": \"NovaSenha@789\"
  }' | jq ."

# Get Users (se for admin)
test_endpoint "GET All Users (Admin)" "curl -s $API_URL/users -H 'Authorization: Bearer $TOKEN' | jq ."

# Logout
test_endpoint "POST Logout" "curl -s -X POST $API_URL/auth/logout -H 'Authorization: Bearer $TOKEN' | jq ."

echo -e "\n✅ Testes concluídos!"
