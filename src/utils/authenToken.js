const jwt = require('jsonwebtoken')
const {accessTokenSecret} = require('./keySecret')

function authenToken (req, res, next) {
    const authorizationHeader =  req.headers['authorization']
    const token = authorizationHeader
    // return res.send(authorizationHeader)
    if(!token) return res.status(403).json({message: 'token is empty'})
    
    jwt.verify(token,accessTokenSecret,(err,data)=>{
        if(err) return res.status(403).json({message:'token was expired or not right'})
        next()
    })
}

module.exports = authenToken