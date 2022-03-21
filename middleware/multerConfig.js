const multer = require('multer');

const MIME_TYPE = {
  'image/jpg' : 'jpg',
  'image/png' : 'png',
  'image/jpeg' : 'jpg'
}

const storage = multer.diskStorage( {
  destination: (req, file , callback) => {
    callback(null, 'images')
  },
  filename: (req ,file , callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPE[file.mimetype];
    callback(null,"product" + Date.now() + name);
  }
})

module.exports = multer({storage}).single('image');