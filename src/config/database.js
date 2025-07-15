const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
    }
});

// Test connection function
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com PostgreSQL estabelecida com sucesso');
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar com PostgreSQL:', error);
        return false;
    }
};

module.exports = {
    sequelize,
    testConnection
};
