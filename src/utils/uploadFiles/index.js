const multer  = require('multer');

function uploadFile() {
  const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './src/public/images')
      },
      filename: function (req, file, cb) {    
        cb(null, Date.now() +'.jpg' )
      }
    })
  const upload = multer({ storage: storage })
  return upload
  
}

module.exports = uploadFile