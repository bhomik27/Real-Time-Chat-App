const Sequelize = require('sequelize');

const sequelize = require('../util/database');


// Define User model
const User = sequelize.define('User', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isloggedin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = User;  