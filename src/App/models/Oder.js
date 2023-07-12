const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const OderSchema = new Schema(
    {
        infoOfOder: {type: Array, required: true},
        infoOfUser:{
            type: mongoose.Schema.Types.ObjectId, ref: 'Account' 
        },
        typeOfPayment: {type: String, required: true},
        codeDiscount: {type: String},
        isPaid:{type:Boolean, default: false},
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { 
        collection:'Oder',
        timeseries: true
    },
);

OderSchema.query.sortable = function(req){
        const type = ['asc','desc'].includes(req.query?.type)?req.query?.type:'desc'
        return this.sort({
            [req.query.column]:type
        })
}

module.exports = mongoose.model('Oder', OderSchema);