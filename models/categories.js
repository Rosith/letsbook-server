const query = require('../db/index').query;

const common = require('./common');
let tableName = 'categories';

exports.all = async () =>{
  return common.all(tableName);
};

exports.findBy = async property => {
  return common.findBy(tableName, property);
};

exports.create = async properties => {
  const errors = await validate(properties);
  if (errors) {
    return { errors };
  }

  const createdItem = (await query(
    `INSERT INTO "categories"(
      "name", "description", "active") 
      values ($1, $2, $3) returning *`,
    [
      properties.name,
      properties.description,
      properties.active ? properties.active : false,
    ]
  )).rows[0];
  return createdItem;
};

exports.update = async newProperties => {
  const oldProps = await this.findBy({ id: newProperties.id });
  const properties = { ...oldProps, ...newProperties };
  const errors = await validate(properties);

  if (errors) {
    return { errors };
  }

  const updatedCategory = (await query(
    `UPDATE "categories" SET
      "name"=$1,
      "description"=$2,
      "active"=$3
     WHERE id=$4 RETURNING *`,
    [
      properties.name,
      properties.description,
      properties.active,
      properties.id,
    ]
  )).rows[0];

  return updatedCategory;
};

async function validate(properties) {
  const requiredProperties = ['name', 'description'];
  const errors = common.validateRequired(properties, requiredProperties);

  const existingName = await exports.findBy({ name: properties.name });
  const thatNameIsntMe = existingName ? existingName.id !== Number(properties.id) : false;

  if (existingName && thatNameIsntMe) {
    const error = 'Name already taken';
    errors.push(error);
  }
  if (errors.length > 0) {
    return errors;
  }
}
