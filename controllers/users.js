const User = require('../models/user');
const userSerializer = require('../serializers/user');

const currentUser = require('../lib/currentUser');

exports.index = async (req, res, next) => {
  //const user = await currentUser(req.headers.jwt);
  //const requestorIsAdmin = user.admin;

  let users;
  users = await User.all();

  const serializedUsers = users.map(user => userSerializer(user));
  res.json({ users: await Promise.all(serializedUsers) });
};

exports.create = async (req, res, next) => {
  const user = await User.create(req.body);
  if (user.errors) {
    res.json({ user });
  } else {
    const serializedUser = await userSerializer(user);
    res.json({ user: serializedUser });
  }
};

exports.show = async (req, res, next) => {
  try {
    const user = await User.find(req.params.id);
    const serializedUser = await userSerializer(user);
    res.json({ user: serializedUser });
  } catch (e) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
};

exports.me = async (req, res, next) => {
  const token = req.headers.jwt;
  const user = await currentUser(token);
  res.json({ user: user });
};

exports.update = async (req, res, next) => {
  const user = await currentUser(req.headers.jwt);
  const requestorIsAdmin = user.admin;
  const properties = {
    ...req.body,
    ...{ id: req.params.id },
  };

  const updatedUser = await User.update(
    allowedProperties(properties, requestorIsAdmin)
  );

  if (updatedUser.errors) {
    res.json({ user: updatedUser });
  } else {
    const serializedUser = await userSerializer(updatedUser);
    res.json({ user: serializedUser });
  }
};

function allowedProperties(properties, requestorIsAdmin) {
  if (requestorIsAdmin) { return properties; }

  const whitelist = [
    'id',
    'firstName',
    'lastName',
    'email',
    'bio',
    'birthday',
    'claimToFame',
    'hobbies',
    'nickname',
    'pronouns',
    'skills',
    'password',
  ];

  let allowedProperties = {};
  whitelist.forEach(item => {
    properties[item] ? allowedProperties[item] = properties[item] : false;
  });

  return allowedProperties;
}
