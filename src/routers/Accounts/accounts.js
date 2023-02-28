const AccountController = require('../../App/controllers/Accounts/AccountController')
const BoughtController = require('../../App/controllers/Accounts/Bought')
const CartController = require('../../App/controllers/Accounts/Cart')
const authenToken = require('../../utils/authenToken')
const uploadFile = require('../../utils/uploadFiles')

const express = require('express')
const router = express.Router()



// account
router.post('/create',AccountController.register)
router.post('/login',AccountController.login)
router.post('/logout',AccountController.logout)
router.post('/refreshTokens',AccountController.refreshToken)


// cart
router.post('/cart/get',authenToken,CartController.get)
router.post('/cart/update',authenToken,CartController.update)
router.delete('/cart/delete',authenToken,CartController.delete)

// bought

router.get('/',AccountController.get)

// info
router.post('/info-of-user',uploadFile().single('image'),AccountController.updateInfoOfUser)

router.get('/get-info-of-user',AccountController.getInfoOfUserCookie)


module.exports = router
