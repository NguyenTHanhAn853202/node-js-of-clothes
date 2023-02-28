const OderSchema = require('../../models/Oder')
const Account = require('../../models/Accounts')
const Bought = require('../../models/Bought')
const limit = 10
class OderController {
    
    // saving user's information bought
    create(req,res,next) {
        const userID = req.body.userID
        const infoOfOder = req.body.infoOfOder
        if(!Array.isArray(infoOfOder) && infoOfOder?.length>0) {
            return res.json({title:'error',message:"oder's information is not array",success:false})
        }
        if(!userID || !infoOfOder) {
            return res.json({
                title:'error',
                success:false,
                message:'input infoOfOder or userID'
            })
        }
        const newOder = new OderSchema({infoOfOder: infoOfOder,infoOfUser:userID})
        if(newOder){
            newOder.save()
                .then(data=>{
                    if(!data){
                        return res.json({success:false,title:'Error',message:'Error at newOder'})
                    }
                })   
        }
        Bought.create({userID,bought:infoOfOder})
            .then((data) =>{
                if(!data) return res.json({success:false,title:'Error',message:'Error at new bought'})
            })
            .catch(next)
        Account.findOne({_id:userID})
            .then((data) =>{
                infoOfOder.forEach(item => {
                    data.cart = data.cart.filter(fill=> fill.idProduct !== item.idProduct);
                });
                data.save() 
                res.status(200).json({success: true,data:data?.cart,title:'oder product'})
            })
            .catch(next)
    }
    // lấy thông tin oder của khách
    getAnOder(req, res,next){
        const id = req.query.id
        if(id){
            res.json({title:'error',success:false,message:'input id, please'})
        }
        OderSchema.find({_id:id}).populate('infoOfUser','name email phoneNumber')
            .then(data => res.status(200).json({
                title:'get info oder',
                success:true,
                message:'taking info is successful',
                data
            }))
            .catch(next)
    }
}

module.exports = new OderController()