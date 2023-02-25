const Product = require('../../models/Product')

const fs = require('fs')



class ProductController {
    
    get(req, res,next) {
        const nameSearch = req.query.find
        Product.find().sortable(req)
            .then(data=>{
                const newData = data.filter(product => product.name.includes(nameSearch))
                return res.status(200).json(newData)
            })
            .catch(next)
    }

    getOne(req, res, next){
        Product.find({slug: req.query.slug})
            .then(data=>res.json(...data))
            .catch(next)
    }

    getProduct(req, res, next){
        const idProduct = req.query.idProduct
        Product.find({_id: idProduct})
            .then(data=>res.json(data))
            .catch(next)
    }
    
    getImage(req, res, next) {
        const imgName = `src/public/images/${req.query.image}`
        fs.readFile(imgName,(err, data)=>{
            res.end(data)
        })
    }

    getType(req, res, next) {
        const type = req.query.typeProduct
        if(!type) return res.status(400).json({
            message:'fail! the type is empty or invalid',
            data:[]
        })
       
        Product.find({type:type}).sortable(req)
            .then(products => res.status(200).json(
                {
                    message:'successfully',
                    data:products
                }
            ))
            .catch(next)
    }

    uploadProduct(req, res, next){
        const file = req.files
        console.log(req.files);
        return res.json({file:file,message:'successfully uploaded'})
        const name = req.body.name
        const costDefualt = req.body.costDefualt
        const sizeDefualt = req.body.sizeDefualt     
        const number = req.body.number
        const type = req.body.type
        
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
          number:number,
          type:type
        }
    
        // const product = new Product(dataProduct)
        // product.save()
        //     .then(product => res.json(product))
        //     .catch(next) 
    }
}

module.exports = new ProductController();