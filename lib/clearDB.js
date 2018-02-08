const query = require('../db/index').query;

module.exports = async () => {
  await query('delete from "users"');
  await query('delete from "categories"');
};
