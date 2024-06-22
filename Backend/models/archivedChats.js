// models/archivedChat.js
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ArchivedChat = sequelize.define('archivedChats', {
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
    },
    UserId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

module.exports = ArchivedChat;
 