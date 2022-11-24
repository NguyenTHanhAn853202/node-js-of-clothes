const homeController = require('../App/controllers/HomeContraller')
const express = require('express');
const router = express.Router();

router.post('/',homeController.add)
router.get('/',homeController.index)

module.exports = router
