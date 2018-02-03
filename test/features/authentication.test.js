const expect = require('expect');
const request = require('supertest');

require('../helpers/testSetup');

const app = require('../../app');

const createUser = require('../helpers/objectCreationMethods').createUser;

describe('Authentication - ', () => {
  it('users that log in receive JWT & their serialized user obj', async () => {
    const email = 'valide.user@example.com';
    const password = 'password';

    const user = await createUser({ email, password });
    const res = await request(app)
      .post('/login')
      .send({ email, password })
      .expect(200);

    expect(res.body.jwt).not.toBe(undefined);
    expect(res.body.user).toEqual({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      admin: user.admin,
      role: user.role,
    });

    expect(res.body.user.passwordDigest).toEqual(undefined);
    expect(res.body.user.createdAt).toEqual(undefined);
    expect(res.body.user.updatedAt).toEqual(undefined);
  });

  it('users cannot login without valid credentials', async () => {
    const email = 'valide.user@example.com';
    const password = 'password';

    await createUser({ email, password });
    const wrongPasswordRes = await request(app)
      .post('/login')
      .send({ email, password: 'wrong password' })
      .expect(200);
    expect(wrongPasswordRes.body.jwt).toBe(undefined);
    expect(wrongPasswordRes.body.user).toEqual(undefined);
    expect(wrongPasswordRes.body.errors).toEqual([
      'Email or Password is incorrect',
    ]);

    const noUserRes = await request(app)
      .post('/login')
      .send({ email: 'invalid.user@example.com', password })
      .expect(200);
    expect(noUserRes.body.jwt).toBe(undefined);
    expect(noUserRes.body.user).toEqual(undefined);
    expect(noUserRes.body.errors).toEqual(['Email or Password is incorrect']);
  });

});
