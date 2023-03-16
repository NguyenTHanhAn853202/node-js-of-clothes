const express = require('express');
const router = express.Router()
const Cart = require('../../App/controllers/Cart/CartController')
const authenToken = require('../../utils/authenToken')

// get
router.get('/get',authenToken,Cart.get)
//  post
router.post('/add-product',authenToken,Cart.update)
// delete
router.delete('/delete',authenToken,Cart.delete)
// put
router.post('/update-product',authenToken,Cart.updateInCart)

module.exports = router