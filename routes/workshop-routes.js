const express = require("express");

const router = express.Router();
const { check } = require("express-validator");
const workshopController = require('../controllers/workshop-controller')
const checkAuth = require('../middleware/check-auth')

const fileUpload = require('../middleware/file-upload')


router.post('/workshop-signUp',fileUpload.single('document'),workshopController.WorkShopSignUp)
router.get('/get-workshop-data',workshopController.GetAllWorkshopData)
router.put('/workshop-approve',workshopController.ApproveWorkshop)
router.delete('/workshop-delete',workshopController.DeleteWorkshop)
router.get('/workshop-approved',workshopController.GetAllApprovedWorkshops)
router.get('/get-total-workshops',workshopController.getWorkshopDetails)


//This route below routes check is available token
router.use(checkAuth)

router.get('/protected',(req,res) =>{
    return res.status(200).json({
        message:"Hello"
    })
})


module.exports = router;
