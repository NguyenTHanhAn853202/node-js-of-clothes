const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoughtSchema = new Schema(
    {
        userID: {type: String, required: true},
        bought:{type:Array,required: true},
        idProduct: {type: String, required: true},
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { 
        collection:'Bought',
        timeseries: true
    },
);

module.exports = mongoose.model('Bought', BoughtSchema);