// middlewares/auth.js
const { verifyToken } = require("../lib/jwt");
const User = require('../models/user');
const { UnAuthorizedError } = require('../lib/errors');

async function authenticate(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnAuthorizedError('Authentication required');
    }
    const token = auth.split(' ')[1];
    let payload;
    try {
      payload = verifyToken(token);
    } catch (err) {
      throw new UnAuthorizedError('Invalid or expired token');
    }

    const user = await User.findById(payload._id);
    if (!user) throw new UnAuthorizedError('User not found');

    // Attach user to request (keep necessary fields)
    req.user = {
      _id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authenticate;
