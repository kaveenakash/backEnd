const express = require("express");

const router = express.Router();
const messageController = require('../controllers/Message-Controller')





router.post('/news-save',messageController.SaveNews)
router.get('/get-all-messages',messageController.getAllMessages)
router.post('/get-message-by-id',messageController.getMessageById)
router.post('/sent-message',messageController.SentMessage)


module.exports = router;
