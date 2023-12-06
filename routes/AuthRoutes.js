const router = require('express').Router()
// import auth controller
const AuthController = require('../controllers/AuthController')

// Import auth middleware
// const Auth = require('../middleware/Auth')

//import validation
// const check = require('../validation/CheckValidation')
// const auth = require('../middleware/authVerification')
// route list------------------------------------------------------------------------------------
router.post('/signUp',AuthController.authSignUp)
router.post('/login',AuthController.authLogin)

// Router.js

// Router.js
router.post('/check-login',AuthController.isAlreadyLoggedin)

router.post('/checklogin',AuthController.AlreadyLoggedin)
router.post('/forcelogin',AuthController.forceloginDeviceId)

  
//router.post('/forgotPassword',AuthController.forgotPassword)
router.post('/resetPassword',AuthController.resetPassword)
router.post('/adduserbyadmin',AuthController.adduserbyadmin)
router.post('/adduserbyadmin1',AuthController.adduserbyadmin1)
router.post('/getRoleId',AuthController.getRoleIdFromEmail)


router.post('/createStateId',AuthController.createStateId)
router.post('/createCityId',AuthController.createCityId)
router.post('/createMainId',AuthController.createMainId)
router.post('/createPlayerId',AuthController.createPlayerId)
router.get("/getPassword", AuthController.getPass)
router.post("/Checkplayerlist", AuthController.Checkplayerlist)
router.post("/changePassword", AuthController.changePassword)
//router.post('/signUp',check.registerValidator(),AuthController.authSignUp)
//router.post('/login',check.loginValidator(),AuthController.authLogin)
//router.post('/forgotPassword',check.forgotPasswordValidator(),AuthController.forgotPassword)


module.exports = router