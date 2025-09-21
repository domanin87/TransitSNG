'use strict';
module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('News', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.TEXT, allowNull: false },
    content: { type: DataTypes.TEXT },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {});
  return News;
};
