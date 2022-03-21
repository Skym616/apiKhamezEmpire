const Product = require('../Models/ProductModel');
const Ordered = require('../Models/OrderedModel');
const User = require('../Models/UserModel');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.addProduct = (req, res) => {
  const ProductObjet = JSON.parse(req.body.product);
  const product = new Product({
    ...ProductObjet,
    image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  product
    .save()
    .then((response) => {
      res.status(201).json({ message: 'Produit créé avec succès' });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.getAllProduct = (req, res) => {
  Product.find()
    .then((products) => {
      res.status(200).json({ products: products });
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
};

exports.getOneProduct = (req, res) => {
  Product.findOne({ _id: req.params.idProduct })
    .then((response) => {
      res.status(200).json({ product: response });
    })
    .catch((error) => {
      res.status(404).json({ error: error });
    });
};

exports.updateProduct = (req, res) => {
  const productObject = req.file ? {
    ...JSON.parse(req.body.product),
    image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...JSON.parse(req.body.product) };
  Product.updateOne({ _id: req.params.idProduct }, { ...productObject, _id: req.params.idProduct })
    .then((response) => {
      res.status(201).json({ message: 'Produit mise à jour avec succès' });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.deleteProduct = (req, res) => {
  Product.findOne({ _id: req.params.idProduct }).then((product) => {
    const filename = product.image.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Product.deleteOne({ _id: req.params.idProduct })
        .then((response) => {
          res.status(200).json({ message: 'Produit supprimé avec succès' });
        })
        .catch((error) => {
          res.status(404).json({ error: error });
        });
    });
  }).catch((error) => res.status(500).json({ error }));
};

exports.addOrdered = (req, res) => {
  const ordered = new Ordered({ ...req.body });
  ordered.save().then((response) => {
    res.status(201).json({ message: response._id });
  }).catch((error) => {
    res.status(400).json({ error });
  });
};

exports.getAllOrdered = (req, res) => {
  Ordered.find()
    .then((ordered) => {
      res.status(200).json({ ordered });
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

exports.updateValid = (req, res) => {
  Ordered.updateOne({ _id: req.body._id }, { ...req.body }).then((response) => {
    res.status(201).json({ message: 'Status mis à jour avec succès' });
    const tab = JSON.parse(req.body.ordered);
    const products = tab.map(item => {
      const obj = {
        ...item,
        quantitySell: item.quantitySell + item.qt,
        quantity: item.quantity <= 0 ? null : item.quantity - item.qt
      };
      const { qt, ...object } = obj;
      return object;
    });
    products.forEach((product) => {
      Product.updateOne({ _id: product._id }, { ...product }).then((res) => console.log('res')).catch(e => console.log('e'));
    });
  }).catch((error) => {
    res.status(400).json({ error });
  });
};

exports.updateCancel = (req, res) => {
  Ordered.updateOne({ _id: req.body._id }, { ...req.body }).then((response) => {
    res.status(201).json({ message: 'Status mis à jour avec succès' });
  }).catch((error) => {
    res.status(400).json({ error });
  });
};

exports.register = (req, res) => {
  bcrypt.hash(req.body.password, 10).then((passHash) => {
    const user = new User({ email: req.body.email, password: passHash });
    user.save().then((response) => {
      res.status(201).json({ message: 'Utilisateur créé avec succès' });
    }).catch((error) => {
      res.status(400).json({ error });
    });
  }).catch((error) => {
    res.status(500).json({ error });
  });
};

exports.login = (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }
    bcrypt.compare(req.body.password, user.password).then((valid) => {
      if (!valid) {
        return res.status(401).json({ message: 'Mot de passe invalide' });
      }
      res.status(200).json({
        userId: user._id, token: jwt.sign(
          { userId: user._id },
          'RANDOM_TOKEN_SECRET',
          { expiresIn: '24h' }
        )
      });
    }).catch((error) => {
      res.status(500).json({ error });
    });
  }).catch((error) => {
    res.status(500).json({ error });
  });
};
