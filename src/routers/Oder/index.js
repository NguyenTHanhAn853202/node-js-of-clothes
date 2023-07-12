const express = require('express');
const router = express.Router();
const OrderController = require('../../App/controllers/Oders');
const { employee } = require('../../utils/roles');

// định nghĩa routers

router.post('/create',OrderController.create);
router.post('/banking',OrderController.banking)

// get
router.get('/get-one-oder',OrderController.getAnOder)

router.get('/show-order',employee,OrderController.showOrder)

module.exports = router