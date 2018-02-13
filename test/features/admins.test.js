const expect = require('expect');
const jwt = require('jsonwebtoken');
const request = require('supertest');

require('../helpers/testSetup');

const app = require('../../app');

const createUser = require('../helpers/objectCreationMethods').createUser;

describe('Admin users', () => {
  it('are the only users who can create users', async () => {
    const admin = await createUser({
      admin: true,

    });
    const newUserAttributes = {
      firstName: 'Chandra',
      lastName: 'Bose',
      email: 'bose.chandra@example.com',
      mobile: '737383',
      admin: false,
      role: 1,
      password: 'password',
    };

    const guestRes = await request(app)
      .post('/users')
      .send(newUserAttributes)
      .expect(404);

    expect(guestRes.body).toEqual({ error: { status: 404 }, message: 'Not Found' });

    const user = await createUser();
    const userToken = jwt.sign({ currentUserId: user.id }, process.env.JWT_SECRET);

    const userRes = await request(app)
      .post('/users')
      .set('jwt', userToken)
      .send(newUserAttributes)
      .expect(404);

    expect(userRes.body).toEqual({ error: { status: 404 }, message: 'Not Found' });

    const adminToken = jwt.sign({ currentUserId: admin.id }, process.env.JWT_SECRET);

    const adminRes = await request(app)
      .post('/users')
      .set('jwt', adminToken)
      .send(newUserAttributes)
      .expect(200);

    expect(adminRes.body.jwt).toEqual(undefined);
    expect(adminRes.body.user.firstName).toBe(newUserAttributes.firstName);
    expect(adminRes.body.user.lastName).toBe(newUserAttributes.lastName);
    expect(adminRes.body.user.email).toBe(newUserAttributes.email);
    expect(adminRes.body.user.admin).toBe(newUserAttributes.admin);
    expect(adminRes.body.user.mobile).toBe(newUserAttributes.mobile);
    expect(adminRes.body.user.passwordDigest).toEqual(undefined);
  });

  it('cannot create a user w/o email, pw, first & last name', async () => {
    const admin = await createUser({
      admin: true,
      manager: true,
    });

    const adminToken = jwt.sign({ currentUserId: admin.id }, process.env.JWT_SECRET);

    const res = await request(app)
      .post('/users')
      .set('jwt', adminToken)
      .send({})
      .expect(200);

    expect(res.body.user).toEqual({
      'errors': [
        'Email cannot be blank',
        'First Name cannot be blank',
        'Last Name cannot be blank',
        'Password cannot be blank',
      ],
    });
  });

  it('are the only users who can update all user attributes', async () => {

    const admin = await createUser({
      admin: true,
    });

    const originalAttributes = {
      admin: false,
      password: 'password',
      role: 3,
    };

    const user = await createUser(originalAttributes);

    const updatedAttributes = {
      admin: true,
      role: 1,
    };

    const userToken = jwt.sign({ currentUserId: user.id }, process.env.JWT_SECRET);

    const userRes = await request(app)
      .put(`/users/${user.id}`)
      .set('jwt', userToken)
      .send(updatedAttributes)
      .expect(200);

    expect(userRes.body.user.admin).toBe(originalAttributes.admin);

    const adminToken = jwt.sign({ currentUserId: admin.id }, process.env.JWT_SECRET);

    const resUpdated = await request(app)
      .put(`/users/${user.id}`)
      .set('jwt', adminToken)
      .send(updatedAttributes)
      .expect(200);

    expect(resUpdated.body.user.admin).toBe(updatedAttributes.admin);
    expect(resUpdated.body.user.role).toBe(updatedAttributes.role);
  });

  it('are the only users who can create new Categories', async () => {
    const admin = await createUser({
      admin: true,
    });
    const newCategoriesAttributes = {
      name: 'Sales',
      description: 'marketing',
      active: false,
    };

    const guestRes = await request(app)
      .post('/categories')
      .send(newCategoriesAttributes)
      .expect(404);

    expect(guestRes.body).toEqual({ error: { status: 404 }, message: 'Not Found' });

    const user = await createUser();
    const userToken = jwt.sign({ currentUserId: user.id }, process.env.JWT_SECRET);

    const userRes = await request(app)
      .post('/categories')
      .set('jwt', userToken)
      .send(newCategoriesAttributes)
      .expect(404);

    expect(userRes.body).toEqual({ error: { status: 404 }, message: 'Not Found' });

    const adminToken = jwt.sign({ currentUserId: admin.id }, process.env.JWT_SECRET);

    const adminRes = await request(app)
      .post('/categories')
      .set('jwt', adminToken)
      .send(newCategoriesAttributes)
      .expect(200);

    expect(adminRes.body.jwt).toEqual(undefined);
    expect(adminRes.body.category.name).toBe(newCategoriesAttributes.name);
    expect(adminRes.body.category.description).toBe(newCategoriesAttributes.description);
    expect(adminRes.body.category.active).toBe(newCategoriesAttributes.active);
  });
});
