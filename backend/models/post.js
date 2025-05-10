const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user'); // Add this line at the top with other requires

const Post = sequelize.define('Post', {
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  imageKey: { type: DataTypes.STRING }, // S3 key for the uploaded image
});

Post.belongsTo(User);
User.hasMany(Post);

module.exports = Post;