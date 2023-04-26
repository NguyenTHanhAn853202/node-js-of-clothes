const Cart = require('../../models/Cart')

class CartController {
    // get all product in cart
    get(req, res, next) {
        const perPage = req.query.perPage*1
        const page = req.query.page*1
        const start = (page -1)*perPage
        const id = req.query.id
        Cart.find({userID:id}).skip(start).limit(perPage).populate('idProduct','slug name')
            .then(data =>{
                if(data){
                   return res.status(200).json({
                        success:true,
                        title:'success',
                        currentPage:page,
                        data                     
                   }) 
                }
                return res.status(200).json({success:false,title:'error',message:'check info',data:[]})
            })
            .catch(next) 
    }

    async updateInCart(req,res,next) {
        const result = []
        const cartUpdate = Array.isArray(req.body.cartUpdate)?req.body.cartUpdate : [] 
        await cartUpdate.forEach(item=>{
            Cart.updateOne({$and:[{_id:item._id},{size:item.size},{color:item.color}]},{
                number:item.number
            })
                .then()
                .catch(err=>{
                   return  res.send('error')
                })
        })
        const data =await Cart.find().populate('idProduct','name slug')
        return res.status(200).json({
            title:'success',
            success:true,
            data
        })
    }

    // update cart (add product into cart) 
    async update(req, res, next) {
        const {id,idProduct,number,size,color,image,price} = req.body
        await Cart.findOneAndUpdate({ userID: id,idProduct,size,color,price,image},
            { $inc: { number:number } },
            { upsert: true, returnOriginal: false }
        ).populate('idProduct')
            .then(data=>{
                if(!data) return res.status(200).json({
                    title:'success',
                    success:true,
                    data:[],
                })
            })
            .catch(err=>{
                console.log(err);
                return res.send(err)
            })
        await Cart.find().populate('idProduct','name')
            .then(data=> res.status(200).json({
                    title:'success',
                    success:true,
                    data,
                    }))
            .catch(next)
           
    }

    // delete a product in cart
    async delete(req, res, next) {
        try {
            const id = req.body.id
            const userID = req.body.userID
            await Cart.deleteOne({ _id: id,userID})
                .then(data => {
                    if(!data) return res.status(403).json({
                        success:false,
                        title:'error',
                        message: 'check info'
                    })               
                })
                .catch(err=> res.send(err))
            await Cart.find({userID}).populate('idProduct','name slug')
                .then(data=> res.status(200).json({
                    success: true,
                    title:'success',
                    data
                }))
                .catch(next)
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = new CartController()
