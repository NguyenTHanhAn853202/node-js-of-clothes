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
        name:{type:String,maxLength:40,default:'Chưa có tên'},
        avatar:{type:String,default:`http://${serverName}:${serverPort}/product/open-image?image=avatarDefault.jpg`},
        phoneNumber:{type:String,maxLength:15,default:null},
        birthday:{type:Date,default:null},
        address:{type:String,default:null},
        email:{type:String,default:null},
        sex:{type:String,default:null},
        role:{type:String,default:'customer'},
        disable:{type:Boolean,default:false},
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