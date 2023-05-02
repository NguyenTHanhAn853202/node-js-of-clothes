const AccountController = require('../../App/controllers/Accounts/AccountController')

const authenToken = require('../../utils/authenToken')
const uploadFile = require('../../utils/uploadFiles')
const {manager} = require('../../utils/roles')
const express = require('express')
const router = express.Router()



// manage account employee
router.get('/account-employee',manager,authenToken,AccountController.getAccountEmployee)
router.post('/disable-account-employee',authenToken,manager,AccountController.disableAccount)

// account
router.post('/create',AccountController.register)
router.post('/create-manager',authenToken,manager,AccountController.registerManager)

router.post('/login',AccountController.login)
router.post('/change-password',AccountController.changePassword)
router.post('/logout',AccountController.logout)
router.post('/refreshTokens',AccountController.refreshToken)
router.post('/create-account-employee',authenToken,AccountController.createAccountForEmployee)

// info
router.post('/info-of-user',uploadFile().single('image'),authenToken,AccountController.updateInfoOfUser)

router.get('/get-info-of-user',authenToken,AccountController.getInfoOfUserCookie)


module.exports = router
