const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Chat = sequelize.define('chats', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    message: {
        type: Sequelize.STRING
    },
    groupId: {
        type: Sequelize.INTEGER,
        allowNull: false 
    }
});

module.exports = Chat;
