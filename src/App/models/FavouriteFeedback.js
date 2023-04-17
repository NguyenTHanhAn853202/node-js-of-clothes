const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavouriteFeedbackSchema = new Schema(
    {
        userID:{type: mongoose.Schema.Types.ObjectId,ref:'Account'},
        idProduct:{type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        idFeedback:{type: mongoose.Schema.Types.ObjectId},
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { 
        collection:'FavouriteFeedback',
        timeseries: true
    },
);

module.exports = mongoose.model('FavouriteFeedback', FavouriteFeedbackSchema);