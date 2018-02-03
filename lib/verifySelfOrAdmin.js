const currentUser = require('./currentUser');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  const token = req.headers.jwt;
  const currUser = await currentUser(token);
  const adminUser = (await User.find(currUser.id)).admin;
  const authorized = currUser.id === Number(req.params.id) || adminUser;

  if (!currUser || !authorized) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
  next();
};
