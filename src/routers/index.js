const homePage = require('./product')
const AccountPage = require('./Accounts/accounts')

function route(app){
    app.use('/account',AccountPage)
    app.use('/product',homePage)
}

module.exports = route;
