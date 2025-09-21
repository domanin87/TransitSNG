'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transport = sequelize.define('Transport', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fromCity: { type: DataTypes.STRING },
    toCity: { type: DataTypes.STRING },
    capacity: { type: DataTypes.FLOAT },
    vehicleType: { type: DataTypes.STRING },
    licensePlate: { type: DataTypes.STRING },
    driverName: { type: DataTypes.STRING },
    contactPhone: { type: DataTypes.STRING },
    availableFrom: { type: DataTypes.DATE }
  }, {});
  return Transport;
};
