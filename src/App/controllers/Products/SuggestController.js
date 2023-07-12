const Product = require("../../models/Product");

class SuggestController{
    async newProduct(req,res,next){
        try {
            const limit = req.query.limit || 5
            const type = req.query.type;
            const data = await Product.find(type?{type:type}:{}).limit(limit).sort({'createdAt':-1})
            return res.status(200).json({
                title:'success',
                success:true,
                data:data
            })
        } catch (error) {
            res.send(error)
        }
    }
    
}

module.exports = new SuggestController()