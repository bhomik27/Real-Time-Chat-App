const express = require('express');

const router = express.Router();

const Userauthentication = require('../middleware/auth');
const chatController=require('../controllers/chat')

router.post('/createmessage', Userauthentication.authenticate, chatController.createMessage);

router.get('/getallchats', chatController.getAllChats);

module.exports = router;