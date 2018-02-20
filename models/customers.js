const bcrypt = require('bcryptjs');

const query = require('../db/index').query;

exports.all = async () => {
  const customers = (await query('SELECT * FROM "customers"')).rows;
  return customers;
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
    `INSERT INTO "customers"(
      "firstName", "lastName", "email", "mobile", "passwordDigest" ) 
      values ($1, $2, $3, $4, $5) returning *`,
    [
      properties.firstName,
      properties.lastName,
      formatEmail(properties.email),
      properties.mobile,
      passwordDigest,
    ]
  )).rows[0];
  return createdUser;
};

exports.find = async id => {
  const user = (await query('SELECT * FROM "customers" WHERE "id" = $1 LIMIT 1', [
    id,
  ])).rows[0];
  return user;
};

exports.findBy = async property => {
  const key = Object.keys(property)[0];
  let findByQuery;
  switch (key) {
  case 'email':
    findByQuery = 'SELECT * FROM "customers" WHERE "email" = $1 LIMIT 1';
    break;
  case 'mobile':
    findByQuery = 'SELECT * FROM "customers" WHERE "mobile" = $1 LIMIT 1';
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
    `UPDATE "customers" SET
    "firstName"=$1,
    "lastName"=$2,
    "email"=$3,
    "mobile"=$4,
    "passwordDigest"=$5 WHERE id=$6 RETURNING *`,
    [
      properties.firstName,
      properties.lastName,
      formatEmail(properties.email),
      properties.mobile,
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
    whereQuery = 'SELECT * FROM "customers" WHERE "lastName" = $1';
    break;
  case 'email':
    whereQuery = 'SELECT * FROM "customers" WHERE "email" = $1';
    break;
  case 'mobile':
    whereQuery = 'SELECT * FROM "customers" WHERE "mobile" = $1';
    break;
  case 'firstName':
    whereQuery = 'SELECT * FROM "customers" WHERE "firstName" = $1';
    break;
  }

  const value = property[key];
  const customers = (await query(whereQuery, [value])).rows;
  return customers;
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

  const existingEmailUser = await exports.findBy({ email: properties.email });
  const thatEmailIsntMe = existingEmailUser ? existingEmailUser.id !== Number(properties.id) : false;
  if (existingEmailUser && thatEmailIsntMe) {
    const error = 'Email already taken';
    errors.push(error);
  }

  const existingMobileUser = await exports.findBy({ mobile: properties.mobile });
  const thatMobileIsntMe = existingMobileUser ? existingMobileUser.id !== Number(properties.id) : false;
  if (existingMobileUser && thatMobileIsntMe) {
    const error = 'Mobile already taken';
    errors.push(error);
  }

  if (errors.length > 0) {
    return errors;
  }
}
