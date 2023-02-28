const Account = require('../../models/Accounts')

class BoughtController{

    // get all Products that customer bought
    get(req, res, next){
        const account = req.body.userName
        
        Account.findOne({userName: account})
            .then(account => res.json(account.bought))
            .catch(next)
    }


    //  buy product and update cart
    buyAndUpdate(req, res, next){
        const account = req.body.userName
        const idProduct = req.body.idProduct
        let number = req.body.number

        Account.findOne({userName: account})
            .then(account =>{
                const sameProduct = account.cart.find((item,index) =>item.idProduct===idProduct)
                const indexCart = account.cart.indexOf(sameProduct);
                account.cart.splice(indexCart,1)
                account.bought= [...account.bought,{idProduct,number}]
                account.save()
                res.json({idProduct,number})
            })
            .catch(next)
    }

    // delete product in bought
    delete(req, res, next){
        const account = req.body.userName
        const _id = req.body._id

        Account.findOne({userName: account})
            .then(account =>{
                const sameProduct = account.bought.find((item,index) => item._id ===_id)
                const index = account.bought.indexOf(sameProduct)
                account.bought.splice(index,1)
                account.save()
                res.json(sameProduct)
            })
            .catch(next)
    }

}

module.exports = new BoughtController()
