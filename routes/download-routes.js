const express = require("express");

const router = express.Router();
const { check } = require("express-validator");
const downloadController = require('../controllers/Download-Controller')
const checkAuth = require('../middleware/check-auth')

const fileUpload = require('../middleware/file-upload')



router.post('/admin-add-template',fileUpload.single('document'),downloadController.AddTemplate)
router.get('/all-templates',downloadController.GetAllTemplates)
router.delete('/template-delete',downloadController.DeleteTemplate)

//This route below routes check is available token
router.use(checkAuth)

router.get('/protected',(req,res) =>{
    return res.status(200).json({
        message:"Hello"
    })
})


module.exports = router;
