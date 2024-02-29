const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.decodedToken = decodedToken;
    next();
  });
};

module.exports = authenticateToken;
