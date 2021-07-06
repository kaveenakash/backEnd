const express = require("express");

const router = express.Router();
const { check } = require("express-validator");
const adminController = require('../controllers/Admin-Controller')
const checkAuth = require('../middleware/check-auth')



router.post('/create-editor',adminController.AddEditor)
router.get('/get-editor-list',adminController.GetAllEditors)
router.delete('/delete-editor',adminController.DeleteEditor)
//This route below routes check is available token
router.use(checkAuth)

router.get('/protected',(req,res) =>{
    return res.status(200).json({
        message:"Hello"
    })
})

module.exports = router;
