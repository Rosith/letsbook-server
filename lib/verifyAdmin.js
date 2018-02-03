const currentUser = require('./currentUser');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  const token = req.headers.jwt;
  const currUser = await currentUser(token);
  const adminUser = (await User.find(currUser.id)).admin;

  if (!adminUser) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
  next();
};
