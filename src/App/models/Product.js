const mongoose = require('mongoose');
const Schema = mongoose.Schema;
slug = require('mongoose-slug-generator');
mongoose.plugin(slug)


const Product = new Schema(
    {
        name: { type: String, default: 'san pham chua co ten' },
        imageDefualt: { type: String},
        costDefualt: { type: Number},
        sizeDefualt: { type: Array},
        number: { type:Number},
        description: { type: String, default:'chưa có mô tả sản phẩm'},
        image:[
            {
                nameOfColor: { type: String, default: 'mau tong hop'},
                imageOfColor:{ type: String,required: true},
                costOfColor:{ type: Number},
                numberOfColor:{type: Number},
                sizeOfColor:{ type: Array}
            }
        ],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        slug: { type: String, slug: "name",unique: true},
    },
    { timeseries: true },
);

module.exports = mongoose.model('Product', Product);