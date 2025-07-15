const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                error: 'Token de acesso requerido',
                message: 'Por favor, forneça um token de autenticação válido'
            });
        }

        const decoded = verifyToken(token);

        // Verify user still exists and is active
        const user = await User.findByPk(decoded.id);
        if (!user || !user.isActive) {
            return res.status(401).json({
                error: 'Token inválido',
                message: 'Usuário não encontrado ou inativo'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Erro de autenticação:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Token inválido',
                message: 'O token fornecido é inválido'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expirado',
                message: 'O token de acesso expirou. Faça login novamente'
            });
        }

        return res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Erro ao processar autenticação'
        });
    }
};

const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Acesso negado',
                message: 'Usuário não autenticado'
            });
        }

        const userRole = req.user.role;
        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                error: 'Acesso negado',
                message: 'Você não tem permissão para acessar este recurso'
            });
        }

        next();
    };
};

module.exports = {
    authenticateToken,
    requireRole
};
