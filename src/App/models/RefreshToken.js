const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RefreshToken = new Schema(
    {
        refreshTokens: { type:Array}
    }
   
);

module.exports = mongoose.model('RefreshToken', RefreshToken);