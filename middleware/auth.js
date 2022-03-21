const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID invalid';
    } else {
      console.log('auth');
      next();
    }
  } catch (error) {
    console.log('non auth');
    res.status(401).json({ error: error + ' Rêquête non authentifié' });
  }
};