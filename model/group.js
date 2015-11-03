var crypto = require('crypto');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
  var model = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV1
    },
    license: {
      type: DataTypes.UUID,
      allowNull: false
    },
    name: {
      // TODO: add unique constraint
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  };

  return sequelize.define('Group', model);
};
