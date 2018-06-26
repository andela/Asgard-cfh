import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


exports.isLoggedIn = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: 'User not logged in',
      });
    }
    req.name = decoded.name;
    req.email = decoded.email;
    return next();
  });
};
