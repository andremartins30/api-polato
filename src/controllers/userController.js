const User = require('../models/User');
const { generateTokens } = require('../utils/jwt');
const { Op } = require('sequelize');

const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = { isActive: true };

        if (search) {
            whereClause = {
                ...whereClause,
                [Op.or]: [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { email: { [Op.iLike]: `%${search}%` } }
                ]
            };
        }

        const { count, rows: users } = await User.findAndCountAll({
            where: whereClause,
            attributes: { exclude: ['password'] },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            message: 'Usuários recuperados com sucesso',
            users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                totalUsers: count,
                hasNext: page * limit < count,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Erro ao buscar usuários'
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado',
                message: 'O usuário solicitado não existe'
            });
        }

        res.json({
            message: 'Usuário encontrado com sucesso',
            user
        });

    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Erro ao buscar usuário'
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = req.user;
        const { name, email } = req.body;

        // Check if email is being changed and if it's already in use
        if (email && email !== user.email) {
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({
                    error: 'Email já em uso',
                    message: 'Este email já está sendo usado por outro usuário'
                });
            }
        }

        // Update user
        const updatedData = {};
        if (name) updatedData.name = name.trim();
        if (email) updatedData.email = email.toLowerCase();

        await user.update(updatedData);

        // Generate new tokens if email was changed
        const tokens = email ? generateTokens(user) : { user };

        res.json({
            message: 'Perfil atualizado com sucesso',
            ...tokens
        });

    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Erro ao atualizar perfil'
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const user = req.user;
        const { currentPassword, newPassword } = req.body;

        // Verify current password
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                error: 'Senha atual incorreta',
                message: 'A senha atual fornecida está incorreta'
            });
        }

        // Update password
        await user.update({ password: newPassword });

        res.json({
            message: 'Senha alterada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Erro ao alterar senha'
        });
    }
};

const deactivateAccount = async (req, res) => {
    try {
        const user = req.user;

        await user.update({ isActive: false });

        res.json({
            message: 'Conta desativada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao desativar conta:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Erro ao desativar conta'
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUser = req.user;

        // Prevent self-deletion
        if (id === currentUser.id) {
            return res.status(400).json({
                error: 'Operação não permitida',
                message: 'Você não pode excluir sua própria conta'
            });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado',
                message: 'O usuário solicitado não existe'
            });
        }

        await user.destroy();

        res.json({
            message: 'Usuário excluído com sucesso'
        });

    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Erro ao excluir usuário'
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateProfile,
    changePassword,
    deactivateAccount,
    deleteUser
};
