const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  icon: {
    type: DataTypes.STRING(10),
    defaultValue: '🎮',
  },
  color: {
    type: DataTypes.STRING(20),
    defaultValue: '#7c3aed',
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
});

module.exports = Category;
