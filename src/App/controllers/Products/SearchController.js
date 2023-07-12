const Product = require('../../models/Product')


class SearchController{
    
    index(req,res,next){
        const name = req.query.name?req.query.name.trim() : ''
        if(name === ''){
            return res.status(200).json({message:'successfully',data:[]})
        }
        Product.find({
           name:{$regex:new RegExp(name,'i')}
        })
            .then((datas)=>{
                return res.status(200).json({title:'success',success:true,data:datas,name:name})
            })
            .catch(next)
    }
}

module.exports = new SearchController();
