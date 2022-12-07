const AccountController = require('../../App/controllers/Accounts/AccountController')
const BoughtController = require('../../App/controllers/Accounts/Bought')
const CartController = require('../../App/controllers/Accounts/Cart')
const express = require('express')
const router = express.Router()


// account
router.post('/create',AccountController.take)
router.post('/check',AccountController.check)

// cart
router.get('/cart/get',CartController.get)
router.put('/cart/update',CartController.update)
router.delete('/cart/delete',CartController.delete)

// bought
router.get('/bought/get',BoughtController.get)
router.put('/bought/update',BoughtController.buyAndUpdate)
router.delete('/bought/delete',BoughtController.delete)

router.get('/',AccountController.get)


module.exports = router
