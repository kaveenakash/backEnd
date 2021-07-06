const express = require("express");

const router = express.Router();

const newsController = require('../controllers/News-Controller')





router.post('/news-save',newsController.SaveNews)
router.get('/get-all-news',newsController.GetAllNews)


module.exports = router;
