const express = require("express");

const router = express.Router();
const messageController = require('../controllers/Message-Controller')





router.post('/message-save',messageController.SaveMessage)
router.get('/get-all-messages',messageController.getAllMessages)
router.post('/get-message-by-id',messageController.getMessageById)
router.post('/sent-message',messageController.SentMessage)
router.delete('/delete-message',messageController.DeleteMessage)

module.exports = router;
