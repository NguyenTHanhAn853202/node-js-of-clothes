const Account = require('../../models/Accounts')


class CartController {

    // get all product in cart
    get(req, res, next){
        const name = req.body.userName
        Account.findOne({userName:name})
            .then(data =>{
                res.json(data.cart)
            })
            .catch(next) 
    }


    // update cart (add product into cart) 
    update(req, res, next){
        const account = req.body.userName;
        const idProduct = req.body.idProduct
        let number = req.body.number
        const name = req.body.name
        const cost = req.body.cost
        const image = req.body.image
        const slugProduct = req.body.slugProduct

        console.log({idProduct,number,name,cost ,image,slugProduct});

        Account.findOne({userName:account})
            .then(account =>{      
                const sameProduct = account.cart.find((item,index) =>item.idProduct===idProduct)
                if(sameProduct){
                    number += sameProduct.number
                    const index = account.cart.indexOf(sameProduct);
                    account.cart[index].number =number 
                    res.json({
                        same:true,
                        data:account.cart[index]
                    })
                }else{
                    account.cart = [...account.cart,{idProduct,number,name,cost ,image,slugProduct}]
                    res.json({same:false,data:{idProduct,number,name,cost ,image,slugProduct}})
                }
                account.save()
            })
            .catch(next) 
    }
    
    // delete a product in cart
    delete(req, res, next) {
        console.log(req.body);
        const account  = req.body.userName;
        const idProduct = req.body.idProduct;
        Account.findOne({userName:account})
            .then(account=>{
                account.cart = account.cart.filter((item,index) => item.idProduct!==idProduct)
                account.save()
                res.json({message:'successfully'})
            })
            .catch(next)
    }
}

module.exports = new CartController()
