const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Thread = require('./Thread');
const Post = require('./Post');
const Like = require('./Like');

// User -> Thread
User.hasMany(Thread, { foreignKey: 'userId', as: 'threads' });
Thread.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Category -> Thread
Category.hasMany(Thread, { foreignKey: 'categoryId', as: 'threads' });
Thread.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Thread -> Post
Thread.hasMany(Post, { foreignKey: 'threadId', as: 'posts' });
Post.belongsTo(Thread, { foreignKey: 'threadId', as: 'thread' });

// User -> Post
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Likes
User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Thread.hasMany(Like, { foreignKey: 'threadId', as: 'likes' });
Like.belongsTo(Thread, { foreignKey: 'threadId', as: 'thread' });

Post.hasMany(Like, { foreignKey: 'postId', as: 'likes' });
Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

module.exports = {
  sequelize,
  User,
  Category,
  Thread,
  Post,
  Like,
};
