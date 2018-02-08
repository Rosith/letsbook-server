const query = require('../db').query;

const common = require('./common');
let tableName = 'services';

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
    `INSERT INTO "services"(
      "categoryId", "name", "description", "icon", "active") 
      values ($1, $2, $3, $4, $5) returning *`,
    [
      properties.categoryId,
      properties.name,
      properties.description,
      properties.icon ? properties.icon : '',
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
    `UPDATE "services" SET
      "categoryId"=$1,
      "name"=$2,
      "description"=$3,
      "icone"=$4
      "active"=$5
     WHERE id=$6 RETURNING *`,
    [
      properties.categoryId,
      properties.name,
      properties.description,
      properties.icon,
      properties.active,
      properties.id,
    ]
  )).rows[0];

  return updatedCategory;
};

async function validate(properties) {

  const requiredProperties = ['categoryId', 'name', 'description'];
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
