const Product = require('../../models/Product')

class SearchController{
    
    index(req,res,next){
        const name = req.query.name.trim() || ''
        if(name === ''){
            return res.status(200).json({message:'successfully',data:[]})
        }
        Product.find({name:{$regex: new RegExp(name, "i") }}).sortable(req)
            .then((datas)=>{
                return res.status(200).json({title:'success',success:true,data:datas})
            })
            .catch(next)
    }
}

module.exports = new SearchController();
