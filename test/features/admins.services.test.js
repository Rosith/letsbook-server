const expect = require('expect');
const jwt = require('jsonwebtoken');
const request = require('supertest');

require('../helpers/testSetup');

const app = require('../../app');

const createUser = require('../helpers/objectCreationMethods').createUser;
const createCategory = require('../helpers/objectCreationMethods').createCategory;

describe('Admin users', () => {
  it('are the only users who can create new Services', async () => {
    const admin = await createUser({
      admin: true,
    });

    const category = await createCategory();
    const newServiceAttributes = {
      categoryId: category.id,
      name: 'book keepint',
      description: 'keeping books',
      active: false,
    };

    const guestRes = await request(app)
      .post('/categories')
      .send(newServiceAttributes)
      .expect(404);

    expect(guestRes.body).toEqual({ error: { status: 404 }, message: 'Not Found' });

    const user = await createUser();
    const userToken = jwt.sign({ currentUserId: user.id }, process.env.JWT_SECRET);

    const userRes = await request(app)
      .post('/categories')
      .set('jwt', userToken)
      .send(newServiceAttributes)
      .expect(404);

    expect(userRes.body).toEqual({ error: { status: 404 }, message: 'Not Found' });

    const adminToken = jwt.sign({ currentUserId: admin.id }, process.env.JWT_SECRET);
    const adminRes = await request(app)
      .post('/categories')
      .set('jwt', adminToken)
      .send(newServiceAttributes)
      .expect(200);

    expect(adminRes.body.jwt).toEqual(undefined);
    expect(adminRes.body.category.name).toBe(newServiceAttributes.name);
    expect(adminRes.body.category.description).toBe(newServiceAttributes.description);
    expect(adminRes.body.category.active).toBe(newServiceAttributes.active);
  });
});
