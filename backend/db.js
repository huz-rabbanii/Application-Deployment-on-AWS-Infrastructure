const { Sequelize } = require('sequelize');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Copy backend/.env.example to backend/.env and fill it in.');
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
});

module.exports = sequelize;