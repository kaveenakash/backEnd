const express = require("express");

const router = express.Router();
const messageController = require('../controllers/Message-Controller')





router.post('/message-save',messageController.SaveMessage)
router.get('/get-all-messages',messageController.getAllMessages)



module.exports = router;
