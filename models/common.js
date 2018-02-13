const query = require('../db/index').query;

exports.all = async (tableName) => {
  const users = (await query(`SELECT * FROM "${tableName}"`)).rows;

  return users;
};

exports.findBy = async (tableName, property) => {
  const key = Object.keys(property)[0];
  const value = property[key];
  const result = (await query(`SELECT * FROM "${tableName}" WHERE "${key}" = $1 LIMIT 1`, [value])).rows[0];
  return result;
};

exports.validateRequired = (properties, requiredProperties) => {
  let errors = [];
  if (requiredProperties && requiredProperties.length) {
    requiredProperties.forEach(requirement => {
      if (!properties[requirement]) {
        const error = `${correctCase(requirement)} cannot be blank`;
        errors.push(error);
      }
    });
  }
  return (errors);
};

function correctCase(string) {
  return string
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => { return str.toUpperCase(); });
}
