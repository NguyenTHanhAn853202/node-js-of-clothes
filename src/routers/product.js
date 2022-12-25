const multer  = require('multer');
const Product = require('../App/models/Product')
const homeController = require('../App/controllers/Products/ProductController')
const express = require('express');
const router = express.Router();
const serverName = require('os').hostname()
const serverPort = require('../utils/serverPort')



let nameImg = []
const storage =  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/public/images')
    },
    filename: function (req, file, cb) {
        const nameNow = Date.now()+ '.jpg'
        nameImg= [...nameImg,nameNow]
      cb(null, nameNow )   
    }
    })

const upload = multer({ storage: storage })


// router.get('/create',homeController.index)
router.post('/create',upload.array('imageOfColor', 10),(req, res, next)=>{
    const name = req.body.name
    const costDefualt = req.body.costDefualt
    const sizeDefualt = req.body.sizeDefualt
    const number = req.body.number

    
    const nameOfColor = Array.isArray(req.body.nameOfColor)?req.body.nameOfColor:[req.body.nameOfColor]
    const costOfColor = Array.isArray(req.body.costOfColor)?req.body.costOfColor:[req.body.costOfColor]
    const numberOfColor = Array.isArray(req.body.numberOfColor)?req.body.numberOfColor:[req.body.numberOfColor]
    const sizeOfColor = Array.isArray(req.body.sizeOfColor)?req.body.sizeOfColor:[req.body.sizeOfColor]
    const imageDefualt = `http://${serverName}:${serverPort}/product/open-image?image=${nameImg[0]}`;
    const image = []



    for (let index = 0; index < nameImg.length; index++) {
      const contantData ={
        nameOfColor: nameOfColor[index],
        imageOfColor:`http://${serverName}:${serverPort}/product/open-image?image=${nameImg[index]}`,
        costOfColor:costOfColor[index]?costOfColor[index]:costDefualt,
        numberOfColor:numberOfColor[index],
        sizeOfColor:sizeOfColor[index]?numberOfColor[index]:sizeDefualt,
      };
      image.push(contantData);
    }

    nameImg =[]

    const dataProduct = {
      name:name,
      image:image,
      imageDefualt:imageDefualt,
      costDefualt:costDefualt,
      sizeDefualt:sizeDefualt,
      number:number
    }

    const product = new Product(dataProduct)
    product.save()
        .then(product => res.json(product))
        .catch(next) 
})


router.get('/get-product',homeController.getProduct) 
router.get('/open-image',homeController.getImage)
router.get('/get-one-product',homeController.getOne)
router.get('/get-products',homeController.get)


module.exports = router
