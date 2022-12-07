const Product = require('../../models/Product')

const fs = require('fs')



class ProductController {
    
    get(req, res,next) {
        Product.find()
            .then(data=>res.json(data))
            .catch(next)
    }
    
    getImage(req, res, next) {
        const imgName = `src/public/images/${req.query.image}`
        fs.readFile(imgName,(err, data)=>{
            res.end(data)
        })
    }

}

module.exports = new ProductController();