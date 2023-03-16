const mongoose = require('mongoose');
const MongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
slug = require('mongoose-slug-generator');
mongoose.plugin(slug)


const Product = new Schema(
    {
        name: { type: String, default: 'san pham chua co ten' },
        type:{ type: String},
        description: { type: String, default: ''},
        image: { type: String},
        price: { type: Number},
        product:{type:Array},
        number:Number,
        color:Array,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        slug: { type: String, slug: "name",unique: true},
    },
    { timeseries: true },
);

Product.plugin(MongooseDelete, { deletedBy: true, overrideMethods:'all' });

// method 
// sort 
Product.query.sortable = function(req){
    if(req.query._sort){
        const type = ['asc','desc'].includes(req.query.type)?req.query.type:'desc'
        return this.sort({
            [req.query.column]:type
        })
    }
    return this
}

module.exports = mongoose.model('Product', Product);