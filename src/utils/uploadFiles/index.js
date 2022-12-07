const multer  = require('multer');

let imgName = ''

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'image')
    },
    filename: function (req, file, cb) {
        imgName= Date.now()
      cb(null, imgName + '.jpg')
    }
  })

const upload = multer({ storage: storage })

module.exports = {upload, imgName }