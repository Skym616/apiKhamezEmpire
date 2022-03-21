const express = require('express');
const router = express.Router();
const ProductController = require('../Controller/ProductController');
const multer = require('../middleware/multerConfig');
const auth = require('../middleware/auth');

router.post('/products', auth, multer, ProductController.addProduct);
router.get('/products', ProductController.getAllProduct);
router.get('/products/:idProduct', ProductController.getOneProduct);
router.put('/products/:idProduct', auth, multer, ProductController.updateProduct);
router.delete('/products/:idProduct', auth, ProductController.deleteProduct);
router.post('/ordered', ProductController.addOrdered);
router.get('/ordered', auth, ProductController.getAllOrdered);
router.put('/ordered', auth, ProductController.updateValid);
router.put('/orderedc', auth, ProductController.updateCancel);
router.post('/register', ProductController.register);
router.post('/login', ProductController.login);

module.exports = router;