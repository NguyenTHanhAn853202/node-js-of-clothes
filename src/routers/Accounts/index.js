const AccountController = require('../../App/controllers/Accounts/AccountController')

const authenToken = require('../../utils/authenToken')
const uploadFile = require('../../utils/uploadFiles')
const {manager} = require('../../utils/roles')
const express = require('express')
const router = express.Router()



// account
router.post('/create',AccountController.register)
router.post('/create-manager',manager,AccountController.registerManager)

router.post('/login',AccountController.login)
router.post('/logout',AccountController.logout)
router.post('/refreshTokens',AccountController.refreshToken)
router.post('/create-account-employee',AccountController.createAccountForEmployee)

// info
router.post('/info-of-user',uploadFile().single('image'),authenToken,AccountController.updateInfoOfUser)

router.get('/get-info-of-user',authenToken,AccountController.getInfoOfUserCookie)


module.exports = router
