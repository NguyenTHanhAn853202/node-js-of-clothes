const mongoose = require('mongoose');
const Schema = mongoose.Schema;
slug = require('mongoose-slug-generator');
mongoose.plugin(slug)


const Product = new Schema(
    {
        name: { type: String, default: 'san pham chua co ten' },
        slug: { type: String, slug: "name" }
    },
    { timeseries: true },
);

module.exports = mongoose.model('Product', Product);