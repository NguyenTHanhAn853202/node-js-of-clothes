const Account = require('../../models/Accounts')
const {accessTokenSecret,refreshTokenSecret} = require('../../../utils/keySecret')
const jwt = require('jsonwebtoken')
const serverPort = require('../../../utils/serverPort')
const mongoose  = require('mongoose')
const isValidID = require('../../../utils/isValidID')
const serverName = require('os').hostname()

const isEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

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

    async registerManager(req, res, next){
        const {userName,userNameManager,password,rePassword,role,yourPassword} = req.body
        const checkAccount = await Account.findOne({userName:userName})
        if(checkAccount) return res.status(200).json({
            success:false,
            message:'user name was exits'
        })
        if(!isEmail.test(userName.trim())) return res.status(200).json({
            success:false,
            message:'check user name'
        })
        const length = password.length > 7;
        const uppercase = password.split('').some((item) => item.toUpperCase() === item);
        const number = password.split('').some((item) => !isNaN(item));
        const speacial = password
            .split('')
            .some((item) => (item < '0' || item > '9') && (item < 'A' || item > 'Z') && (item < 'a' || item > 'z'));
        if(!(length && uppercase && number && speacial)) res.status.json({
            success:false,
            message:'password is invalid'
        })
        if(password !== rePassword) return res.status.json({
            success:false,
            message:'password is not same'
        })
        const account = await Account.findOne({userName:userNameManager})
        if(account.password !== yourPassword) return res.status(200).json({
            success:false,
            message:'check your password'
        })
        if(role.toLowerCase() !=='manager' && role.toLowerCase() !=='employee') return res.status(200).json({
            success:false,
            message:'check role'
        })     
        
        const newAccount = new Account({userName,password,role:role.toLowerCase()})
        newAccount.save()
            .then(data=>res.status(200).json({
                success:true,
                message:'creating successfully',
                data
            }))
            .catch(next)
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
                if(!data) return res.status(200).json({check:false,message:'Sai tài khoản hoặc mật khẩu'})
                if(data?.disable) return res.status(200).json({check:false,message:'Tài khoản đã bị vô hiệu hóa'})
                const accessToken = jwt.sign(dataClient,accessTokenSecret,{expiresIn:'30s'})
                const refreshToken = jwt.sign(dataClient,refreshTokenSecret)
                data.refreshTokens.push(refreshToken)
                data.save()
                res.cookie('id',data._id,{
                    
                }).cookie('userName',data.userName,{
                    
                }).cookie('name',data.name||'')
                .cookie('phoneNumber',data.phoneNumber||'')
                .cookie('avatar',data.avatar||'')
                .cookie('email',data.email||'')
                .cookie('birthday',data.birthday||'')
                .cookie('sex',data.sex||'')
                .cookie('address',data.address||'')            
                return res.status(200).json(
                    {
                        id:data._id,
                        name:data.name,
                        role:data.role,
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
                res.clearCookie('avatar').clearCookie('name').clearCookie('email').clearCookie('phoneNumber').clearCookie('birthday').clearCookie('sex').clearCookie('id').clearCookie('address').clearCookie('userName').clearCookie('role')
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
                        
                    }).cookie('name',data.name||'')
                    .cookie('phoneNumber',data.phoneNumber||'')
                    .cookie('avatar',data.avatar||'')
                    .cookie('email',data.email||'')
                    .cookie('birthday',data.birthday||'')
                    .cookie('sex',data.sex||'')
                    .cookie('address',data.address||'') 
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
                            // res.cookie('id',data._id,{
                    
                            // }).cookie('userName',data.userName,{
                                
                            // }).cookie('name',data.name||'')
                            // .cookie('phoneNumber',data.phoneNumber||'')
                            // .cookie('avatar',data.avatar||'')
                            // .cookie('email',data.email||'')
                            // .cookie('birthday',data.birthday||'')
                            // .cookie('sex',data.sex||'')
                            // .cookie('address',data.address||'')    
                            res.cookie(key,objectFields[key])
                        }
                        res.status(200).json({...objectFields,success:true})
                    })
                    .catch(next)
            })
            .catch(next)
    }

    async createAccountForEmployee(req, res, next) {
        const {userName,password, rePassword,role} = req.body
        if(password !==rePassword) return res.status(403).json({
            title:'error',
            success:false,
            message:'dont same the password'
        })
        const account = await Account.findOne({userName:userName})
        if(account) return res.status(403).json({
            title:'error',
            success:false,
            message:'userName is exits'
        })
        const data = new Account({ userName: userName,role,password })
        data.save()
            .then(data=>res.status(200).json({title:'success',success:true,data}))
            .catch(next)
    }

    async getAccountEmployee(req,res,next){
        try {
            const isDisabled = req.query.isDisabled
            const name = req.query.name.trim()||''
            const role = req.query.role.trim()||''
            let datas 
            if(role.toUpperCase() === 'ALL' && name==='') datas = await Account.find({role:{$not:{$regex:'manager'}},disable:isDisabled})
            else if(role.toUpperCase() === 'ALL' && name!=='') datas = await Account.find({role:{$not:{$regex:'manager'}},
                disable:isDisabled,$or:[{_id:mongoose.Types.ObjectId.isValid(name) ? mongoose.Types.ObjectId(name) : null },{name:{$regex:new RegExp(name,'i')}}]})
            else if(role.toUpperCase() !== 'ALL' && name!=='') datas = await Account.find({role:role,disable:isDisabled,$or:[
                {_id:mongoose.Types.ObjectId.isValid(name) ? mongoose.Types.ObjectId(name) : null },{name:{$regex:new RegExp(name,'i')}}
            ]})
            else datas = await Account.find({role:role,disable:isDisabled})
            if(datas) return res.status(200).json({
                title:'success',
                success:true,
                data:datas
            })
            return  res.send('dont find account' )
        } catch (error) {
            console.log(error);
        }

    }

    async disableAccount(req, res,next){
        const id = req.body.listID || [];
        const isDisabled = req.body.isDisabled
        Account.updateMany({_id:{$in:id}},{$set:{disable:!isDisabled}}, { returnOriginal: false })
            .then(data=>{
                Account.find({_id:{$in:id}},{_id:1})
                    .then(account => res.status(200).json(
                      {
                        title:'success',
                        success:true,
                        data:account
                      }
                    ))
                    .catch(next)
            })
            .catch(next)
    }

    async changePassword(req,res,next) {
        try {
            const userName = req.body.userName
            const userID = isValidID(req.body.userID)
            const oldPassword = req.body.oldPassword
            const newPassword = req.body.newPassword
            const reNewPassword = req.body.reNewPassword
            if(reNewPassword !== newPassword) return  res.status(200).json({
                title:'error',
                success:false,
                message:"Mật khẩu mới không trùng khớp"
            })  
            const account = await Account.updateOne({userName,_id:userID,password:oldPassword},{password:newPassword});

            if(account.modifiedCount) return res.status(200).json({
                success: true,
                title:'success',
                message:'Đổi mật khẩu thành công'
            })

            if(account.matchedCount && !account.modifiedCount) return res.status(200).json({
                success: false,
                title:'error',
                message:'Mật khẩu mới và mật khẩu củ giống nhau'
            })

            return res.status(200).json({
                success:false,
                title:'error',
                message:'Mật khẩu củ hoặc thông tin sai'
            })

       
        } catch (error) {
            res.send(error)
        }
    }


}

module.exports = new AccountController();
