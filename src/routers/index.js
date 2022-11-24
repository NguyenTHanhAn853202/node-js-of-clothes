const homePage = require('./home')

function route(app){
    app.use('/product',homePage)
}

module.exports = route;
