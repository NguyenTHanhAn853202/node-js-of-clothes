const Account = require('../../models/Accounts')

class AccountController{
    
    // take info form client
    take(req, res, next){
        const data = req.body
        Account.findOne({name:data.name},function (err, adventure){
            if (!adventure) {
                const newAccount = new Account(data)
                newAccount.save()
                    .then((data) => res.json(data))
                    .catch(next)
            }
            else{
                res.send(false)
            }
        }) 
    }

    // check info login is true or false
    check(req, res, next){
        const name = req.body.name;
        const password = req.body.password
        Account.findOne({name: name,password:password})
            .then((data) => res.json(data?{check:true}:{check:false}))
            .catch(next)            
    }

    // update cart
    updateCart(req, res, next){
        
    }

    // get all accounts
    get(req, res, next){
        Account.find()
            .then((data) => {
                res.json(data)
                res.end()
            })
            .catch(next)
    }

}

module.exports = new AccountController();
