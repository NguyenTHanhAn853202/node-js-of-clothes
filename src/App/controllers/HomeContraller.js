const Product = require('../models/Product')

class HomeContraller {
   
    index(req, res,next) {
        Product.find()
            .then(data=>res.json(data))
            .catch(next)
    }
    
    // POST 
    add(req, res, next) {
        const dataProduct = req.body;
        const newProduct = new Product(dataProduct);
        console.log(req);
        newProduct.save()
            .then((product) => res.redirect('/product'))
            .catch(next)
    }
}

module.exports = new HomeContraller();