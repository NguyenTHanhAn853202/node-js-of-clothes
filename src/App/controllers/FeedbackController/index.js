const  mongoose  = require('mongoose');
const FavouriteFeedback = require('../../models/FavouriteFeedback')
const Feedback  = require('../../models/Feedback');
const isValidID = require('../../../utils/isValidID');
const Product = require('../../models/Product');
const serverPort = require('../../../utils/serverPort');
const serverName = require('os').hostname()


class FeedbackController{
    // user write feedback
    // async write(req,res,next) {
    //     try {
    //         const userID = req.body?.userID || '';
    //         const idProduct = req.body?.idProduct || ' '
    //         const message = req.body?.message || ' ';
    //         const user = await Accounts.findOne({_id:userID});
            
    //         let data
    //         const comment = {userID,message,userName:user.userName,avatar:user.avatar}
    //         data = await Feedback.updateOne(
    //             {idProduct,count:{$lt:LIMIT}},
    //             {$inc:{count:1},$push:{comment:comment}},
    //         )

    //         const count = await Feedback.countDocuments({idProduct})
    //         if(!data.modifiedCount){
    //             data = await Feedback.updateOne(
    //                 {idProduct,count:{$lt:LIMIT},pageNumber:count+1},
    //                 {$inc:{count:1},$push:{comment:comment}},
    //                 {upsert:true}
    //             )
    //         }
    //         if(data.acknowledged)
    //             return res.status(200).json({
    //                 title:'success',
    //                 success:true,
    //                 data
    //             })
    //         return res.status(403).json({
    //             title:'success',
    //             success:true,
    //             data
    //         })
    //     } catch (error) {
    //         console.log(error);
    //         res.send(error);
    //     }
    // }
    async write(req, res, next) {
        try {
            const stars = Number(req.body.stars)
            const userID = isValidID(req.body.userID)
            const idProduct = isValidID(req.body.idProduct)
            const comment = req.body?.comment
            const fileImages = req.files
            const images = fileImages.map(item=>`http://${serverName}:${serverPort}/product/open-image?image=${item.filename}` )
            const product = await Product.findById(idProduct)           
            if(stars >0 && userID && idProduct && product){
                const data = await Feedback.create({userID,idProduct,comment,stars,image:images})
                const starAverage = (product.starAverage*product.numberFeedback+stars)/(product.numberFeedback + 1)
                await Product.updateOne({_id:idProduct},{$inc:{numberFeedback:1},$set:{starAverage:starAverage}})
                
                if(data) return res.status(200).json({
                    success:true,
                    title:'success',
                    data
                })
            }
            return res.status(403).json({
                title:'error',
                success:false,
                message:'Check stars , userID and idProduct'
            })
            
        } catch (error) {
            console.log(error);
        }
        
    }
    // delete feedback
    async delete(req, res,next) {
        try {
            const userID = isValidID(req.body.userID)
            const idProduct = isValidID(req.body.idProduct)
            const idFeedback = isValidID(req.body.idFeedback)
            const product = await Product.findById(idProduct)
            const feedback = await Feedback.findById(idFeedback)        
            if(product && feedback){
                const starAverage = product?.numberFeedback !==1?(product?.starAverage*product?.numberFeedback-feedback?.stars)/(product?.numberFeedback - 1):0
                await Product.updateOne({_id:idProduct},{$inc:{numberFeedback:-1},$set:{starAverage:starAverage}})
                const data = await Feedback.deleteOne({userID,idProduct,_id:idFeedback})
                if(data.acknowledged && data.deletedCount) return res.status(200).json({
                    title:'success',
                    success:true,
                    data
                })
                else{
                    return res.status(403).json({
                        success:false,
                        title:'invalid',
                        data
                    })
                }
            }    
            else return res.status(403).json({
                title:'error',
                success:false,
                message:'checking input'
            })
           
        } catch (error) {
            console.log(error);
        }
    }
    // favourite feedback
    async favourite(req, res, next) {
        try {
            const userID = isValidID(req.body.userID) 
            const idFeedback = isValidID(req.body.idFeedback)
            const liked = await FavouriteFeedback.find({userID,idFeedback})
            let data
            if(liked.length){
                data = await Feedback.updateOne({_id:idFeedback},{$inc:{favourite:-1}})
                await FavouriteFeedback.deleteOne({userID,idFeedback})
            }else{
                data = await Feedback.updateOne({_id:idFeedback},{$inc:{favourite:1}})
                const newFaFeedback = new FavouriteFeedback({userID,idFeedback})
                newFaFeedback.save()
            }
            if(data.acknowledged && data.modifiedCount) return res.status(200).json({
                title:'success',
                success:true,
                data 
            })
            return res.status(403).json({
                success:false,
                title:'fail'
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    async show(req,res,next){
        try {
            const userID = req.query.userID
            const perPage = req.query.perPage*1
            const page = req.query.page*1
            const start = (page -1)*perPage
            let newData = []
            const idProduct = isValidID(req.query.idProduct)
            const _sort = req.query.sort?req.query.sort.trim().toLowerCase() : 'all'
            let data;
            if(_sort.includes('star')) 
                data = await Feedback.find({idProduct,stars:Number(_sort[0])}).skip(start).limit(perPage).populate('userID','avatar name');
            else if(_sort==='image')
                data = await Feedback.find({idProduct,$where:function(){
                    return this.image.length>0
                }}).skip(start).limit(perPage).populate('userID','avatar name');
            else if(_sort==='hascomment') data = await Feedback.find({idProduct,comment:{$nin:['',null]}}).skip(start).limit(perPage).populate('userID','avatar name');
            else data = await Feedback.find({idProduct}).skip(start).limit(perPage).populate('userID','avatar name');
            
            for (let index = 0; index < data.length; index++) {
                const liked = await FavouriteFeedback.find({ idFeedback: data[index]._id, userID: userID });
                newData = [...newData,{...data[index]._doc,liked:liked.length?true:false}]
            }
            
            return res.status(200).json({
                success:true,
                title:'success',
                data:newData
            })
        } catch (error) {
            console.log(error);
        }
        
    }

}

module.exports = new FeedbackController();
