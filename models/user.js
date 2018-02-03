const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const query = require('../db/index').query;

const userSerializer = require('../serializers/user');

exports.all = async () => {
  const users = (await query('SELECT * FROM "users"')).rows;
  return users;
};

exports.authenticate = async credentials => {
  const user = (await query('SELECT * FROM "users" WHERE "email" = $1', [
    credentials.email,
  ])).rows[0];

  const valid = user
    ? await bcrypt.compare(credentials.password, user.passwordDigest)
    : false;

  if (valid && !user.archived) {
    const serializedUser = await userSerializer(user);
    const token = jwt.sign({ currentUserId: user.id }, process.env.JWT_SECRET);
    return { jwt: token, user: serializedUser };
  } else {
    return { errors: ['Email or Password is incorrect'] };
  }
};

exports.create = async properties => {
  const errors = await validate(properties);
  if (errors) {
    return { errors };
  }

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const passwordDigest = bcrypt.hashSync(properties.password, salt);

  const createdUser = (await query(
    `INSERT INTO "users"(
      "firstName", "lastName", "email", "mobile", "admin", "role", "passwordDigest" ) 
      values ($1, $2, $3, $4, $5, $6, $7) returning *`,
    [
      properties.firstName,
      properties.lastName,
      formatEmail(properties.email),
      properties.mobile,
      properties.admin ? properties.admin : false,
      properties.role,
      passwordDigest,
    ]
  )).rows[0];
  return createdUser;
};

exports.find = async id => {
  const user = (await query('SELECT * FROM "users" WHERE "id" = $1 LIMIT 1', [
    id,
  ])).rows[0];
  return user;
};

exports.findBy = async property => {
  const key = Object.keys(property)[0];
  let findByQuery;
  switch (key) {
  case 'email':
    findByQuery = 'SELECT * FROM "users" WHERE "email" = $1 LIMIT 1';
    break;
  }

  const value = property[key];
  const user = (await query(findByQuery, [value])).rows[0];
  return user;
};

exports.update = async newProperties => {
  const oldProps = await this.find(newProperties.id);
  const properties = { ...oldProps, ...newProperties };
  if (newProperties.password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordDigest = bcrypt.hashSync(newProperties.password, salt);
    properties.passwordDigest = passwordDigest;
  }

  const errors = await validate(properties);
  if (errors) {
    return { errors };
  }

  const updatedUser = (await query(
    `UPDATE "users" SET
    "firstName"=$1,
    "lastName"=$2,
    "email"=$3,
    "mobile"=$4,
    "admin"=$5,
    "role"=$6,
    "passwordDigest"=$7 WHERE id=$8 RETURNING *`,
    [
      properties.firstName,
      properties.lastName,
      formatEmail(properties.email),
      properties.mobile,
      properties.admin ? properties.admin : false,
      properties.role,
      properties.passwordDigest,
      properties.id,
    ]
  )).rows[0];

  return updatedUser;
};

exports.where = async property => {
  const key = Object.keys(property)[0];
  let whereQuery;
  switch (key) {
  case 'lastName':
    whereQuery = 'SELECT * FROM "users" WHERE "lastName" = $1';
    break;
  case 'email':
    whereQuery = 'SELECT * FROM "users" WHERE "email" = $1';
    break;
  case 'mobile':
    whereQuery = 'SELECT * FROM "users" WHERE "mobile" = $1';
    break;
  case 'firstName':
    whereQuery = 'SELECT * FROM "users" WHERE "firstName" = $1';
    break;
  }

  const value = property[key];
  const users = (await query(whereQuery, [value])).rows;
  return users;
};

function formatEmail(email) {
  return email.trim().toLowerCase();
}

function correctCase(string) {
  return string
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => { return str.toUpperCase(); });
}

async function validate(properties) {
  const errors = [];

  const requiredProperties = ['email', 'firstName', 'lastName'];
  requiredProperties.forEach(requirement => {
    if (!properties[requirement]) {
      const error = `${correctCase(requirement)} cannot be blank`;
      errors.push(error);
    }
  });

  if (!properties['password'] && !properties['id']) {
    const error = 'Password cannot be blank';
    errors.push(error);
  }

  const existingEmailUser = await exports.findBy({ email: properties.email });
  const thatEmailIsntMe = existingEmailUser ? existingEmailUser.id !== Number(properties.id) : false;
  if (existingEmailUser && thatEmailIsntMe) {
    const error = 'Email already taken';
    errors.push(error);
  }

  if (errors.length > 0) {
    return errors;
  }
}
