const homePage = require('./product')
const AccountPage = require('./Accounts/accounts')
const Oder = require('./Oder/index')

function route(app){
    app.use('/account',AccountPage)
    app.use('/product',homePage)
    app.use('/oder',Oder)
}

module.exports = route;
