const expect = require('expect');
const request = require('supertest');

require('../helpers/testSetup');

const app = require('../../app');

const createCategory = require('../helpers/objectCreationMethods').createCategory;

describe('Categories', () => {
  it('can be listed for any user', async () => {
    const category = await createCategory();

    const resCategory = await request(app)
      .get('/categories')
      .expect(200);

    expect(resCategory.body.categories.length).toEqual(1);
    const newCategory = resCategory.body.categories[0];
    expect(newCategory.id).not.toBe(undefined);
    expect(newCategory).toEqual({
      id: category.id,
      name: category.name,
      description: category.description,
      active: category.active,
    });

    expect(newCategory.createdAt).toEqual(undefined);
    expect(newCategory.updatedAt).toEqual(undefined);
  });
});
