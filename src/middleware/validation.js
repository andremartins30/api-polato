const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Dados inválidos',
            message: 'Por favor, corrija os erros abaixo',
            errors: errors.array().map(error => ({
                field: error.param,
                message: error.msg,
                value: error.value
            }))
        });
    }

    next();
};

const validateRegister = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome deve ter entre 2 e 100 caracteres')
        .notEmpty()
        .withMessage('Nome é obrigatório'),

    body('email')
        .isEmail()
        .withMessage('Email deve ter um formato válido')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email é obrigatório'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Senha deve ter pelo menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),

    handleValidationErrors
];

const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Email deve ter um formato válido')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email é obrigatório'),

    body('password')
        .notEmpty()
        .withMessage('Senha é obrigatória'),

    handleValidationErrors
];

const validateUpdateProfile = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome deve ter entre 2 e 100 caracteres'),

    body('email')
        .optional()
        .isEmail()
        .withMessage('Email deve ter um formato válido')
        .normalizeEmail(),

    handleValidationErrors
];

const validateChangePassword = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Senha atual é obrigatória'),

    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('Nova senha deve ter pelo menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Nova senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número'),

    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateUpdateProfile,
    validateChangePassword,
    handleValidationErrors
};
