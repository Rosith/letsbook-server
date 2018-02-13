const User = require('../../models/user');
const Categories = require('../../models/categories');
const Services = require('../../models/services');

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

exports.createCategory = async overrides => {
  const randomNumber = randomDigits();

  const defaults = {
    name: `Alpha${randomNumber}`,
    description: `Rays ${randomNumber}`,
    active: true,
  };

  return await Categories.create({ ...defaults, ...overrides });
};

exports.createService = async overrides => {
  const randomNumber = randomDigits();
  const category = await exports.createCategory();

  const defaults = {
    categoryId: category.id,
    name: `Alpha ${randomNumber}`,
    description: `Rays ${randomNumber}`,
    icon: 'icon/icon1.png',
    active: true,
  };

  return await Services.create({ ...defaults, ...overrides });
};
