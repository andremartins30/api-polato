const { sequelize } = require('../config/database');
const User = require('./User');

// Define associations here if needed
// Example:
// User.hasMany(Post);
// Post.belongsTo(User);

const models = {
    User
};

// Sync all models
const syncModels = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('📊 Todos os modelos foram sincronizados com sucesso');
    } catch (error) {
        console.error('❌ Erro ao sincronizar modelos:', error);
    }
};

module.exports = {
    sequelize,
    ...models,
    syncModels
};
