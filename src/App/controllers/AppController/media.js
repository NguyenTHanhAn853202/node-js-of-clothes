const fs = require('fs')
class Media{
    getImage(req, res, next) {
        const id = `src\\public\\media\\${req.query.image}`
        fs.readFile(id,(err, data)=>{
            res.end(data)
        })
    }
}

module.exports = new Media()