const jwt = require('jsonwebtoken');
const { JWT_SECRET = "mysecretkey@123", JWT_EXPIRES_IN } = process.env;

const signToken = (payload) => jwt.sign(
    payload, JWT_SECRET, 
    // { expiresIn: JWT_EXPIRES_IN }
);

const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = { signToken, verifyToken };
