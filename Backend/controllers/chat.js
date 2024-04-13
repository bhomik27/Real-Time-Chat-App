const Chat = require('../models/chat');

const createMessage = async (req, res) => {
    try {
        const message = req.body.message;
        if (!message) {
            return res.status(400).json({ message: "Cannot send empty message." });
        } else if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized. User not authenticated." });
        } else {
            const chat = await Chat.create({ message: message, userId: req.user.id });
            console.log(chat);
            return res.status(200).json({ message: "Successfully created chat." });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = {
    createMessage
};
