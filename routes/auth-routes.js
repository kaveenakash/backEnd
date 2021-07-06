const express = require("express");

const router = express.Router();
const { check } = require("express-validator");
const authController = require('../controllers/Auth-Controller')
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


router.post('/signUp',fileUpload.single('document'),authController.SignUp)
router.post('/login',authController.Login)

//This route below routes check is available token
router.use(checkAuth)

router.get('/protected',(req,res) =>{
    return res.status(200).json({
        message:"Hello"
    })
})

module.exports = router;
