const serverPort = require('../../../utils/serverPort')
const serverName = require('os').hostname()
class Home {
    overView(req, res, next) {
        res.status(200).json({
            image:{
                model:`http://${serverName}:${serverPort}/app/media?image=overView-home.jpg`
            }
        })
    }
    
}

module.exports = new Home();