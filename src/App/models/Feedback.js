const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema(
    {
        userID:{type: mongoose.Schema.Types.ObjectId,ref:'Account'},
        // pageNumber:{type: Number,default: 0},
        idProduct:{type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        comment:{type:String,default:'Người dùng không viết đánh giá'},
        // count:{type: Number,max: 5,default:0},
        stars:{type:Number,max: 5,min:1,required:true},
        favourite:{type:Number,min:0,default:0},
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { 
        collection:'Feedback',
        timeseries: true
    },
);

module.exports = mongoose.model('Feedback', FeedbackSchema);