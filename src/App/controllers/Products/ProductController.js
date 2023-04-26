const Product = require('../../models/Product')
const serverPort = require('../../../utils/serverPort')
const serverName = require('os').hostname()
const fs = require('fs')

class ProductController {
    
    get(req, res,next) {
        const nameSearch = req.query.find
        Product.find({name:{$regex:new RegExp(nameSearch)}}).sortable(req)
            .then(data=>{
                return res.status(200).json(data)
            })
            .catch(next)
    }

    async getOne(req, res, next){
        try {
            const slug =req.query.slug || ''
            const data = await Product.findOne({slug:slug })
            const suggestion =  await Product.find({type:data.type,slug:{$ne:slug}}).limit(10)
            res.json({
                title:'success',
                success:true,
                data:{
                    data,
                    suggestion
                }
            })
        } catch (error) {
            res.send(error)
        }
        
    }

    getProduct(req, res, next){
        const idProduct = req.query.idProduct
        Product.find({_id: idProduct})
            .then(data=>res.json(data))
            .catch(next)
    }
    
    getImage(req, res, next) {
        const id = `src\\public\\images\\${req.query.image}`
        fs.readFile(id,(err, data)=>{
            res.end(data)
        })
    }

    getType(req, res, next) {
        const type = req.query.typeProduct
        if(!type) return res.status(400).json({
            message:'fail! the type is empty or invalid',
            data:[]
        })
       
        Product.find({type:type}).sortable(req)
            .then(products => res.status(200).json(
                {
                    message:'successfully',
                    data:products
                }
            ))
            .catch(next)
    }

    uploadProduct(req, res, next){
        const file = req.files
        const {dataProduct,name,type,description} = req.body
        let number=0;;
        const color = []
        const newDataProduct = JSON.parse(dataProduct)
        const storeData = newDataProduct.map((item,i)=>{
            number+=item?.number || 0
            color.push(item?.color || '')
            return {
                imagePath:file[i].originalname===item.fileName && file[i].size===item.fileSize?`http://${serverName}:${serverPort}/product/open-image?image=${file[i].filename}`:'',
                price:item?.price||0,
                size:item?.size||[],
                number:item?.number||0,
                color:item?.color||'',
            }
        })
        const data = new Product({
            image:storeData[0]?.imagePath,
            price:storeData[0]?.price,
            name,
            color:color,
            product:storeData,
            type,
            description,
            number
        })
        if(data){
            data.save()
                .then(data => res.status(200).json({title:'success',success:true,data}))
                .catch(next)
        }
    }

    async delete(req, res, next) {
        try {
            const id = req.body.id;
            const data = await Product.findOneAndDelete({ _id: id });
            res.status(200).json({
                title:'success',success:true,data
            })
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new ProductController();