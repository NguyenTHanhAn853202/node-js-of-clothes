const express = require('express');
const router = express.Router();
const OderController = require('../../App/controllers/Oders')

// định nghĩa routers

router.post('/create',OderController.create);

// get
router.get('/get-one-oder',OderController.getAnOder)

module.exports = router