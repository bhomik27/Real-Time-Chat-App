const Chat = require('../models/chat');

const createMessage = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: "Cannot send empty message." });
        } else if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized. User not authenticated." });
        } else {
            const chat = await Chat.create({ message: message });
            console.log(chat);
            return res.status(200).json({ message: "Successfully created chat." });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const getAllChats = async (req, res) => {
    try {
        const chats = await Chat.findAll({ attributes: ['id', 'message', 'createdAt', 'updatedAt'] });
        res.status(200).json({ chats });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error." });
    }
};


module.exports = {
    createMessage,
    getAllChats
};
