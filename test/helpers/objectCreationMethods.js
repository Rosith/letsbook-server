const User = require('../../models/user');

const randomDigits = () => {
  const pad = '0000';
  const num = Math.floor(Math.random() * 9999);
  return (pad + num).slice(-4);
};

exports.createUser = async overrides => {
  const randomNumber = randomDigits();

  const defaults = {
    firstName: `Alpha${randomNumber}`,
    lastName: `Rays${randomNumber}`,
    email: `alpha${randomNumber}@example.com`,
    admin: false,
    mobile: 1234567890,
    role: 3,
    password: 'password',
  };

  return await User.create({ ...defaults, ...overrides });
};
