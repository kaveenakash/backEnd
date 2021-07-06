const express = require("express");

const router = express.Router();
const { check } = require("express-validator");
const presentationController = require('../controllers/PresentationController')
const checkAuth = require('../middleware/check-auth')

const fileUpload = require('../middleware/file-upload')
//  router.get('/',(req,res,next) =>{
//      console.log('Get request in place')
//      res.json({message:"It Works"})
//  })

//  router.get('/:pid',(req,res,next) =>{
//      const placeId = req.params.id;

//      console.log(placeId)
//      return res.json({message:"Hello"})
//  })

// router.post('/login',userController.login)

//Validation
//  router.post('/',check('title').not().isEmpty(),check('description).isLength({min:5}),controller)


router.post('/presentation-signUp',fileUpload.single('document'),presentationController.PresentationSignUp)
router.get('/get-presentation-data',presentationController.GetAllPresentations)
router.put('/research-paper-approve',presentationController.ApprovePresentation)
router.delete('/research-paper-delete',presentationController.DeleteResearchPresentation)
router.get('/research-paper-approved',presentationController.GetAllApprovedResearchPapers)
router.get('/get-total-presentations',presentationController.getPresentationDetails)
//This route below routes check is available token
router.use(checkAuth)

router.get('/protected',(req,res) =>{
    return res.status(200).json({
        message:"Hello"
    })
})


module.exports = router;
