const express = require('express');

const router = express.Router();

const Userauthentication = require('../middleware/auth');
const chatController=require('../controllers/chat')

router.post('/createmessage/:groupId/:userId', Userauthentication.authenticate, chatController.createMessage);

router.get('/getallchats', chatController.getAllChats);

router.get('/getallchatsofgroup/:groupId', chatController.getAllChatsOfGroup);


module.exports = router;