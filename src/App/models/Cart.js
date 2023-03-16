const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const CartShema = new Schema(
    {
        userID:{type:String, required:true},
        idProduct:{type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        size:{type:String, required:true},
        color:{type:String, required:true},
        number:{type:Number,required:true},
        price:Number,
        image:String,   
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { 
        collection:'Cart',
        timeseries: true
    },
);

module.exports = mongoose.model('Cart', CartShema);