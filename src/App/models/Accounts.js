const mongoose = require('mongoose');
const Schema = mongoose.Schema;
slug = require('mongoose-slug-generator');
mongoose.plugin(slug)
const serverName = require('os').hostname()
const serverPort = require('../../utils/serverPort')

const Account = new Schema(
    {
        userName: { type: String,required: true},
        password:{type:String,required:true},
        name:{type:String,maxLength:40},
        avatar:{type:String,default:`http://${serverName}:${serverPort}/product/open-image?image=avatarDefault.jpg`},
        phoneNumber:{type:String,maxLength:15},
        birthday:{type:Date},
        address:{type:String},
        email:{type:String},
        sex:{type:String},
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
        refreshTokens:{type:Array},
        whiteListFreshTokens: {type:Array},
    },
    { timeseries: {
        timeField: 'timestamp_property',
        metaField: 'metadata_property',
        granularity: 'hours',
      },
    },
);

module.exports = mongoose.model('Account', Account);