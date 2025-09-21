'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    role: { type: DataTypes.ENUM('user','moderator','admin','superadmin'), defaultValue: 'user' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    isDriver: { type: DataTypes.BOOLEAN, defaultValue: false },
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
    isSuperAdmin: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {});
  return User;
};
