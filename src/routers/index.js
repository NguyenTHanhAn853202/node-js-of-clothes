const Product = require('./Product')
const Account = require('./Accounts')
const Oder = require('./Oder')
const Cart = require('./Cart')

function route(app){
    app.use('/account',Account)
    app.use('/product',Product)
    app.use('/oder',Oder)
    app.use('/cart',Cart)
}

module.exports = route;
