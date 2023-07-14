const express = require('express');
const router = express.Router();
const OrderController = require('../../App/controllers/Oders');
const { employee } = require('../../utils/roles');
const authenToken = require('../../utils/authenToken');

// định nghĩa routers

router.post('/create',authenToken,OrderController.create);
router.post('/banking',authenToken,OrderController.banking)
router.post('/confirm',authenToken,employee,OrderController.confirm)

// get
router.get('/get-one-oder',OrderController.getAnOder)

router.get('/show-order',employee,OrderController.showOrder)

module.exports = router