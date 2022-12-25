const AccountController = require('../../App/controllers/Accounts/AccountController')
const BoughtController = require('../../App/controllers/Accounts/Bought')
const CartController = require('../../App/controllers/Accounts/Cart')
const authenToken = require('../../utils/authenToken')

const express = require('express')
const router = express.Router()



// account
router.post('/create',AccountController.take)
router.post('/login',AccountController.login)
router.post('/logout',AccountController.logout)
router.post('/refreshTokens',AccountController.refreshToken)


// cart
router.post('/cart/get',authenToken,CartController.get)
router.post('/cart/update',authenToken,CartController.update)
router.delete('/cart/delete',authenToken,CartController.delete)

// bought
router.get('/bought/get',authenToken,BoughtController.get)
router.put('/bought/update',authenToken,BoughtController.buyAndUpdate)
router.delete('/bought/delete',authenToken,BoughtController.delete)

router.get('/',AccountController.get)


module.exports = router
