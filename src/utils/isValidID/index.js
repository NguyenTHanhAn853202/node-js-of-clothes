const mongoose = require('mongoose');

const isValidID = (ID) => mongoose.Types.ObjectId.isValid(ID)?mongoose.Types.ObjectId(ID):null;

module.exports = isValidID