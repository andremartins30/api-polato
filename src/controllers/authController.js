const User = require('../models/User');
const { generateTokens } = require('../utils/jwt');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                error: 'Usuário já existe',
                message: 'Um usuário com este email já está cadastrado'
            });
        }

        // Create new user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase(),
            password
        });

        // Generate tokens
        const tokens = generateTokens(user);

        res.status(201).json({
            message: 'Usuário criado com sucesso',
            ...tokens
        });

    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Erro ao criar usuário'
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            return res.status(401).json({
                error: 'Credenciais inválidas',
                message: 'Email ou senha incorretos'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                error: 'Conta inativa',
                message: 'Sua conta foi desativada. Entre em contato com o suporte'
            });
        }

        // Validate password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Credenciais inválidas',
                message: 'Email ou senha incorretos'
            });
        }

        // Update last login
        await user.update({ lastLogin: new Date() });

        // Generate tokens
        const tokens = generateTokens(user);

        res.json({
            message: 'Login realizado com sucesso',
            ...tokens
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Erro ao realizar login'
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = req.user;

        res.json({
            message: 'Perfil recuperado com sucesso',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Erro ao buscar perfil do usuário'
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        const user = req.user;

        // Generate new tokens
        const tokens = generateTokens(user);

        res.json({
            message: 'Token renovado com sucesso',
            ...tokens
        });

    } catch (error) {
        console.error('Erro ao renovar token:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Erro ao renovar token'
        });
    }
};

const logout = async (req, res) => {
    try {
        // Note: With JWT, logout is mainly handled on the frontend
        // by removing the token from storage. Here we just send a success response.
        // For enhanced security, you could implement a token blacklist.

        res.json({
            message: 'Logout realizado com sucesso'
        });

    } catch (error) {
        console.error('Erro no logout:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Erro ao realizar logout'
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    refreshToken,
    logout
};
