const OrderSchema = require('../../models/Oder')
const Account = require('../../models/Accounts')
const Bought = require('../../models/Bought')
const Cart = require('../../models/Cart')
const isValidID = require('../../../utils/isValidID')
const limit = 10
class OderController {
    
    // saving user's information bought
    async create(req,res,next) {
        const userID = req.body.userID
        const infoOfOder = req.body.infoOfOder
        const typeOfPayment = req.body.typeOfPayment
        const codeDiscount = req.body.codeDiscount
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
        const newOder = new OrderSchema({infoOfOder: infoOfOder,infoOfUser:userID,typeOfPayment,codeDiscount})
        if(newOder){
            newOder.save()
                .then(data=>{
                    if(!data){
                        return res.json({success:false,title:'Error',message:'Error at newOder'})
                    }
                })   
        }
        
        await Cart.deleteMany({ _id: { $in: infoOfOder.map(item => item._id) } });
        const cart = await Cart.find().populate('idProduct','name slug')
            return res.status(200).json({
                title:'success',
                success:true,
                data:cart
            })

    }
    // lấy thông tin oder của khách
    getAnOder(req, res,next){
        const id = req.query.id
        if(id){
            res.json({title:'error',success:false,message:'input id, please'})
        }
        OrderSchema.find({_id:id}).populate('infoOfUser','name email phoneNumber')
            .then(data => res.status(200).json({
                title:'get info oder',
                success:true,
                message:'taking info is successful',
                data
            }))
            .catch(next)
    }

    // be paid by banking

    async banking(req, res,next) {
        const {userID, infoOfOder} = req.body;

        const newOrder = new OrderSchema({infoOfOder: infoOfOder,infoOfUser:userID,typeOfPayment:'banking'})
        if(newOrder){
            const data = await newOrder.save()
            return res.status(200).json({
                title:'success',
                success:true,
                data:data
            })
        }
        return res.status(200).json({
            success:false,
            title:'error',
            data:[]
        })
    }

    async showOrder(req, res,next) {
        const data  = await OrderSchema.find().sortable(req).populate('infoOfUser','-password')
        if(data) return res.status(200).json({
            success:true,
            title:"success",
            data:data
        })
        return res.status(200).json({
            success:false,
            title:'error',
            data:[]
        })
    }

    async confirm(req, res, next) {
        const id = isValidID(req.body.idOrder)
        const idInfoOrder = req.body.idInfoOrder
        if(id) {
            const data = await OrderSchema.findOne({_id:id})
            const newData = data.infoOfOder.filter(item=>item._id !== idInfoOrder)
            data.infoOfOder = newData
            const dataSave = await data.save();
            return res.status(200).json({
                success:true,
                title:'confirming successfully',
                data:dataSave
            })
        }
        return res.status(200).json({
            title:'error',
            title:'the ID is not exist'
        })

    }
}

module.exports = new OderController()