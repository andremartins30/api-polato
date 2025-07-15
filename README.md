# Studio API

API backend desenvolvida em Node.js com Express, PostgreSQL e JWT para autenticação de usuários.


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
