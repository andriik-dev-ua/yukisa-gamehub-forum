const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Thread = sequelize.define('Thread', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: { len: [3, 200] },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isPinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isLocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
});

module.exports = Thread;
