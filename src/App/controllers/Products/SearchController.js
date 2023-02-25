const Product = require('../../models/Product')

class SearchController{
    
    index(req,res,next){
        const nameProduct = req.query.name.trim() || ''
        if(nameProduct === ''){
            return res.status(200).json({message:'successfully',data:[]})
        }
        Product.find().sortable(req)
            .then((datas)=>{
                
                const products = datas.filter(item =>item.name.toLowerCase().includes(nameProduct.toLowerCase()))
                
                return res.status(200).json({message: 'successfully',data:products})
            })
            .catch(next)
    }
}

module.exports = new SearchController();
