const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { sequelize } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: 'Muitas tentativas de acesso. Tente novamente em alguns minutos.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Studio API está funcionando',
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0'
    });
});

// API Routes
app.use(`/api/${process.env.API_VERSION || 'v1'}/auth`, authRoutes);
app.use(`/api/${process.env.API_VERSION || 'v1'}/users`, userRoutes);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint não encontrado',
        message: `A rota ${req.originalUrl} não existe`,
        availableRoutes: [
            `/api/${process.env.API_VERSION || 'v1'}/auth`,
            `/api/${process.env.API_VERSION || 'v1'}/users`,
        ]
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);

    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Database connection and server start
const startServer = async () => {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Conexão com PostgreSQL estabelecida com sucesso');

        // Sync database models
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('📊 Modelos do banco de dados sincronizados');
        }

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📱 API disponível em: http://localhost:${PORT}`);
            console.log(`🔍 Health check: http://localhost:${PORT}/health`);
            console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('❌ Erro ao iniciar o servidor:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
