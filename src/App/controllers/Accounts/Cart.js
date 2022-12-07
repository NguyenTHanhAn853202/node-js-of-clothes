const Account = require('../../models/Accounts')


class CartController {

    // get all product in cart
    get(req, res, next){
        Account.find()
            .then(data =>res.json(data.cart))
            .catch(next)
    }

    // update cart (add product into cart) 
    update(req, res, next){
        const account = req.body.name;
        const idProduct = req.body.idProduct
        let number = req.body.number
        Account.findOne({name:account})
            .then(account =>{      
                const sameProduct = account.cart.find((item,index) =>item.idProduct===idProduct)
                if(sameProduct){
                    number += sameProduct.number
                    const index = account.cart.indexOf(sameProduct);
                    account.cart[index].number =number 
                    res.json(account.cart[index])
                }else{
                    account.cart = [...account.cart,{idProduct,number}]
                    res.json({idProduct,number})
                }
                account.save()
            })
            .catch(next) 
    }
    
    // delete a product in cart
    delete(req, res, next) {
        const account  = req.body.name;
        const idProduct = req.body.idProduct;

        Account.findOne({name:account})
            .then(account=>{
                const sameProduct = account.cart.find((item,index) =>item.idProduct===idProduct)
                const index = account.cart.indexOf(sameProduct);
                account.cart.splice(index,1)
                account.save()
                res.json(sameProduct)
            })
            .catch(next)
    }
}

module.exports = new CartController()
