const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://bloguser:blogpass@localhost:5432/blogdb', {
  dialect: 'postgres',
});

module.exports = sequelize;