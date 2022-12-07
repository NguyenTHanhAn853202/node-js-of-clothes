const mongoose = require('mongoose');
const Schema = mongoose.Schema;
slug = require('mongoose-slug-generator');
mongoose.plugin(slug)


const Account = new Schema(
    {
        name: { type: String,required: true},
        password:{type:String,required:true},
        cart:[
            {
                idProduct: { type: String},
                number: { type: Number, required: true}
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