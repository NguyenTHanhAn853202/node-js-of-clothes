const Account = require('../../models/Accounts')
const RefreshToken = require('../../models/RefreshToken')
const {accessTokenSecret,refreshTokenSecret} = require('../../../utils/keySecret')
const jwt = require('jsonwebtoken')

class AccountController{

    // take info form client
    take(req, res, next){
        const data = req.body
        Account.findOne({userName:data.name},function (err, adventure){
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

    refreshToken(req, res, next){
        const token = req.body.token
        if(!token) return res.status(401).json({message: 'token is empty'})
        RefreshToken.find()
            .then(data=>{
                const refreshTokens = data[0].refreshTokens
                if(!refreshTokens.includes(token)) return res.status(403).json({message: 'refreshToken dont has in fereshTokens',check:false})
                jwt.verify(token,refreshTokenSecret,(err,data)=>{
                    if(err) return res.status(403).json({message:'token was expired or not right'})
                    const accessToken = jwt.sign({name:data.name},accessTokenSecret,{expiresIn:'30s'})
                    res.status(200).json({
                        token:{
                            accessToken,
                            expiresIn:Date.now() + (30*1000)
                        }
                    })
                })
            })
            .catch(next)
    }

    // check info login is true or false
    login(req, res, next){
        const dataClient= req.body
        const name = req.body.userName;
        const password = req.body.password
        Account.findOne({userName: name,password:password})
            .then((data) => {
                if(!data) return res.status(404).json({check:false})
                const accessToken = jwt.sign(dataClient,accessTokenSecret,{expiresIn:'30s'})
                const refreshToken = jwt.sign(dataClient,refreshTokenSecret)
                RefreshToken.find()
                    .then((data) => {
                        data[0].refreshTokens.push(refreshToken)
                        data[0].save()
                    })
                res.status(200).json(
                    {
                        check:true,
                        message: 'successfully',
                        refreshToken,
                        token:{
                            accessToken: accessToken,
                            expiresIn:Date.now() + (30*1000)
                        }
                    }
                )
            })
            .catch(next)            
    }

    // logout

    logout(req, res, next){
        const token = req.body.token
        RefreshToken.find()
            .then((data) => {
                data[0].refreshTokens = data[0].refreshTokens.filter(item => item !==token)
                data[0].save()
                res.json({message:'login successful'})
            })
    }

    // get all accounts
    get(req, res, next){
        Account.find({_id:req.body.idProduct})
            .then((data) => {
                res.json({data})
            })
            .catch(next)
    }

}

module.exports = new AccountController();
