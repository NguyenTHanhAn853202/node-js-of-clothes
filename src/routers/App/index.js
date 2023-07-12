const express = require('express');
const router = express.Router();
const Media = require('../../App/controllers/AppController/media')

router.get('/media',Media.getImage)

module.exports = router