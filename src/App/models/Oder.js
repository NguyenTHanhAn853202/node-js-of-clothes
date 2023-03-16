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
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { 
        collection:'Oder',
        timeseries: true
    },
);

module.exports = mongoose.model('Oder', OderSchema);