const jwt = require('jsonwebtoken');
const User = require('../models/user');
const userSerializer = require('../serializers/user');

module.exports = async token => {
  try {
    const id = jwt.verify(token, process.env.JWT_SECRET).currentUserId;
    const user = await User.find(id);
    const serializedUser = await userSerializer(user);
    return serializedUser;
  } catch (err) {
    return undefined;
  }
};
