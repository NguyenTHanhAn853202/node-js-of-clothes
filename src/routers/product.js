const multer  = require('multer');
const Product = require('../App/models/Product')
const ProductController = require('../App/controllers/Products/ProductController')
const searchController = require('../App/controllers/Products/SearchController')
const express = require('express');
const router = express.Router();
const uploadFile = require('../utils/uploadFiles')



router.post('/upload-product',uploadFile().array('imageName',7),ProductController.uploadProduct)

router.get('/get-product',ProductController.getProduct) 
router.get('/open-image',ProductController.getImage)
router.get('/get-one-product',ProductController.getOne)
router.get('/get-products',ProductController.get)
router.get('/search',searchController.index)
router.get('/type',ProductController.getType)


module.exports = router
