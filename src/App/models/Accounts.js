const mongoose = require('mongoose');
const Schema = mongoose.Schema;
slug = require('mongoose-slug-generator');
mongoose.plugin(slug)



const Account = new Schema(
    {
        userName: { type: String,required: true},
        password:{type:String,required:true},
        cart:[
            {
                name:{type:String},
                idProduct: { type: String},
                number: { type: Number, required: true},
                cost:{type:Number},
                image: { type: String},
                slugProduct:{type:String},
                cartAt: { type: Date, default: Date.now },
            }
        ],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        bought:[
            {
                idProduct: { type: String},
                number: { type: Number, required: true},
                boughtAt: { type: Date, default: Date.now },
            }
        ]
    },
    { timeseries: {
        timeField: 'timestamp_property',
        metaField: 'metadata_property',
        granularity: 'hours',
      },
    },
);

module.exports = mongoose.model('Account', Account);