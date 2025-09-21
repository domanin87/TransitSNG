'use strict';
module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('News', {
    title: DataTypes.TEXT,
    content: DataTypes.TEXT,
    isPublished: DataTypes.BOOLEAN
  }, {});
  return News;
};
