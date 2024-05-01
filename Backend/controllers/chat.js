const Chat = require('../models/chats');
const Group = require('../models/groups');
const User = require('../models/users');

const createMessage = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const UserId = req.params.userId;

        const { message } = req.body;

        console.log(`User ${UserId} Group ${groupId}`);

        if (!message) {
            return res.status(400).json({ message: "Cannot send empty message." });
        }

        const chat = await Chat.create({ message, groupId, UserId }); // Include userId

        console.log("Chat created:", chat);

        return res.status(200).json({
            message: "Successfully created chat.",
            chat: chat // Return the created chat object
        });
    } catch (error) {
        console.error("Error creating chat:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const getAllChats = async (req, res) => {
    try {
        const chats = await Chat.findAll({
            attributes: ['id', 'message', 'createdAt', 'updatedAt'],
            order: [['createdAt', 'DESC']],
            limit: 10
        });
        
        return res.status(200).json({ chats });
    } catch (error) {
        console.error("Error fetching all chats:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const getAllChatsOfGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;

        console.log("Group ID:", groupId);

        const group = await Group.findByPk(groupId);
        
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const chats = await Chat.findAll({
            where: { groupId: group.id }, 
            attributes: ['id', 'message', 'createdAt', 'updatedAt'],
            include: [{
                model: User,
                attributes: ['id', 'name'] 
            }]
        });

        return res.status(200).json({ chats });
    } catch (error) {
        console.error("Error fetching group chats:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = {
    createMessage,
    getAllChats,
    getAllChatsOfGroup,
};
