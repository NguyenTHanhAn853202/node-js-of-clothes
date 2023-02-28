const Account = require('../../models/Accounts')
const {accessTokenSecret,refreshTokenSecret} = require('../../../utils/keySecret')
const jwt = require('jsonwebtoken')
const serverPort = require('../../../utils/serverPort')
const serverName = require('os').hostname()
class AccountController{

    // take info form client
    register(req, res, next){
        const data = req.body
        Account.findOne({userName:data.userName},function (err, adventure){
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
        if(!token) return res.status(401).json({
            token:{
                message:'clien do not send token',
                accessToken:'',
                expiresIn: 0
            }
        })
        if(!req.body.userName) return res.json({
            token:{
                message:'user is invalid',
                accessToken: '',
                expiresIn: 0
            }
        });
        Account.findOne({userName: req.body.userName})
            .then(data=>{
                const refreshTokens = data.refreshTokens || []
                if(!refreshTokens.includes(token)) return res.status(403).json({
                    token:{
                        message:'token do not correct',
                        accessToken:'',
                        expiresIn: 0
                    }
                })
                jwt.verify(token,refreshTokenSecret,(err,data)=>{
                    if(err) return res.status(403).json({
                        token:{
                            message:'token expired or invalid',
                            accessToken:'',
                            expiresIn: 0
                        }
                    })
                    const accessToken = jwt.sign({userName:data.userName},accessTokenSecret,{expiresIn:'30s'})
                    if(accessToken){
                        res.status(200).json({
                            token:{
                                message:'successfully',
                                accessToken,
                                expiresIn:Date.now() + (30*1000)
                            }
                        })
                    }
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
                data.refreshTokens.push(refreshToken)
                data.save()
                res.cookie('id',data._id,{
                    
                }).cookie('userName',data.userName,{
                    
                }).cookie('name',data?.name).cookie('phoneNumber',data?.phoneNumber).cookie('avatar',data?.avatar).cookie('email',data?.email).cookie('birthday',data?.birthday).cookie('sex',data?.sex).cookie('address',data?.address)            
                return res.status(200).json(
                    {
                        id:data._id,
                        name:data.name,
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
        const userName = req.body.userName
        Account.findOne({userName:userName})
            .then((data) => {
                if(!data) res.json({message:"do not Find data !"})
                data.refreshTokens = data.refreshTokens.filter(item => item !==token)
                data.save();
                res.clearCookie('avatar').clearCookie('name').clearCookie('email').clearCookie('phoneNumber').clearCookie('birthday').clearCookie('sex').clearCookie('id')
                return res.json({message:'login successful'})
            })
    }

    // get info of user by cookies

    getInfoOfUserCookie(req, res, next) {
        const id= req.query.id;
        const userName = req.query.userName
        Account.findOne({_id:id,userName:userName})
            .then(data=>{
                if(data){
                    res.cookie('id',data._id,{
                    
                    }).cookie('userName',data.userName,{
                        
                    }).cookie('name',data?.name).cookie('phoneNumber',data?.phoneNumber).cookie('avatar',data?.avatar).cookie('email',data?.email).cookie('birthday',data?.birthday).cookie('sex',data?.sex).cookie('address',data?.address)
                    res.status(200).json({success:true,data})
                }else{
                    res.status(403).json({message:'check id or userName',title:'error'})
                }
            })
            .catch(next)
    }

    // get all accounts
    get(req, res, next){
        Account.find({_id:req.body.idProduct})
            .then((data) => {
                res.json({data})
            })
            .catch(next)
    }

    updateInfoOfUser(req, res,next) {
        let objectFields = {}
        const name = req.body.name
        const avatar = req?.file?.filename 
        const phoneNumber = req.body?.phoneNumber
        const birthday = req.body?.birthday
        const sex = req.body?.sex
        const address = req.body?.address
        const email = req.body?.email

        if(phoneNumber) {
            phoneNumber.split('').forEach(item=>{
                if(item>'9' || item < '0') return res.json({ success: false, message:'phone number is invalid'})
            })
        }
        objectFields = name? {...objectFields,name}:{...objectFields}
        objectFields = avatar? {...objectFields,avatar:`http://${serverName}:${serverPort}/product/open-image?image=${avatar}`}:{...objectFields}
        objectFields = phoneNumber? {...objectFields,phoneNumber}:{...objectFields}
        objectFields = birthday? {...objectFields,birthday}:{...objectFields}
        objectFields = sex? {...objectFields,sex}:{...objectFields}
        objectFields = email? {...objectFields,email}:{...objectFields}
        objectFields = address? {...objectFields,address}:{...objectFields}


        Account.findOne({_id:req.body.id})
            .then(account=>{
                Object.assign(account,objectFields)
                account.save()
                    .then(data=>{
                        for (const key in objectFields) {
                            res.cookie('id',data._id,{
                    
                            }).cookie('userName',data.userName,{
                                
                            }).cookie('name',data?.name).cookie('phoneNumber',data?.phoneNumber).cookie('avatar',data?.avatar).cookie('email',data?.email).cookie('birthday',data?.birthday).cookie('sex',data?.sex).cookie('address',data?.address)            
                            res.cookie(key,objectFields[key])
                        }
                        res.status(200).json({...objectFields,success:true})
                    })
                    .catch(next)
            })
            .catch(next)
    }


}

module.exports = new AccountController();
