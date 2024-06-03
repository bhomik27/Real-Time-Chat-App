const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Group = sequelize.define('groups', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    groupName: {
        type: Sequelize.STRING
    },
    groupDescription: {
        type: Sequelize.STRING
    },
    adminIds: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: []
    }
});

module.exports = Group;
