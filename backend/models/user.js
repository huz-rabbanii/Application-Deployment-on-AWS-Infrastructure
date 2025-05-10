const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // You'll set this up next

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
});

module.exports = User;