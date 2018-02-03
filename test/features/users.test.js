const expect = require('expect');
const jwt = require('jsonwebtoken');
const request = require('supertest');

require('../helpers/testSetup');

const app = require('../../app');

const createUser = require('../helpers/objectCreationMethods').createUser;

describe('Users', () => {
  it('can be listed for a logged in user only', async () => {
    const user = await createUser();
    const token = jwt.sign({ currentUserId: user.id }, process.env.JWT_SECRET);

    const resNotLoggedIn = await request(app)
      .get('/users')
      .expect(404);

    expect(resNotLoggedIn.body).toEqual({ message: 'Not Found', error: { status: 404 } });

    const resLoggedIn = await request(app)
      .get('/users')
      .set('jwt', token)
      .expect(200);

    expect(resLoggedIn.body.users.length).toEqual(1);
    const newUser = resLoggedIn.body.users[0];
    expect(resLoggedIn.jwt).toBe(undefined);
    expect(newUser.id).not.toBe(undefined);
    expect(newUser).toEqual({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      admin: user.admin,
      role: user.role,
    });

    expect(newUser.passwordDigest).toEqual(undefined);
    expect(newUser.createdAt).toEqual(undefined);
    expect(newUser.updatedAt).toEqual(undefined);
  });

  it('can be shown with a valid user id for a logged in user only', async () => {
    const user = await createUser();
    const token = jwt.sign({ currentUserId: user.id }, process.env.JWT_SECRET);

    const resNotLoggedIn = await request(app)
      .get(`/users/${user.id}`)
      .expect(404);

    expect(resNotLoggedIn.body).toEqual({ message: 'Not Found', error: { status: 404 } });

    const resLoggedInWrongId = await request(app)
      .get(`/users/${user.id + 10}`)
      .set('jwt', token)
      .expect(404);

    expect(resLoggedInWrongId.body).toEqual({ message: 'Not Found', error: { status: 404 } });

    const resLoggedIn = await request(app)
      .get(`/users/${user.id}`)
      .set('jwt', token)
      .expect(200);

    const showUser = resLoggedIn.body.user;
    expect(resLoggedIn.jwt).toBe(undefined);
    expect(showUser.id).not.toBe(undefined);
    expect(showUser).toEqual({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      admin: user.admin,
      role: user.role,
    });

    expect(showUser.passwordDigest).toEqual(undefined);
    expect(showUser.createdAt).toEqual(undefined);
    expect(showUser.updatedAt).toEqual(undefined);
  });

  it('can update self only', async () => {
    const self = await createUser();
    const other = await createUser();
    const selfToken = jwt.sign({ currentUserId: self.id }, process.env.JWT_SECRET);

    const resOther = await request(app)
      .put(`/users/${other.id}`)
      .set('jwt', selfToken)
      .send({
        firstName: 'Dreamer',
      })
      .expect(404);

    expect(resOther.body).toEqual({ message: 'Not Found', error: { status: 404 } });

    expect(self.firstName).not.toBe('Dreamer');

    const resSelf = await request(app)
      .put(`/users/${self.id}`)
      .set('jwt', selfToken)
      .send({
        firstName: 'Dreamer',
      })
      .expect(200);

    expect(resSelf.body.user.firstName).toBe('Dreamer');
  });

  it('can update self: using pre-existing email address', async () => {
    const user = await createUser();
    const token = jwt.sign({ currentUserId: user.id }, process.env.JWT_SECRET);

    const res = await request(app)
      .put(`/users/${user.id}`)
      .set('jwt', token)
      .send({
        firstName: 'Dreamer',
        lastName: 'Dreams',
        email: user.email,
      })
      .expect(200);

    expect(res.body.user.id).toEqual(user.id);
    expect(res.body.user.firstName).toEqual('Dreamer');
    expect(res.body.user.lastName).toEqual('Dreams');
    expect(res.body.user.email).toEqual(user.email);
  });

  it('cannot update to pre-existing email address', async () => {
    const firstUser = await createUser();
    const secondUser = await createUser();
    const token = jwt.sign({ currentUserId: secondUser.id }, process.env.JWT_SECRET);

    const res = await request(app)
      .put(`/users/${secondUser.id}`)
      .set('jwt', token)
      .send({
        email: firstUser.email,
      })
      .expect(200);

    expect(res.body.user).toEqual({ errors: ['Email already taken'] });
  });

  it('should trim email whitespaces and lower case the email', async () => {
    const user = await createUser({ email: '  DreAmER@example.com ' });
    const token = jwt.sign({ currentUserId: user.id }, process.env.JWT_SECRET);

    const resLoggedIn = await request(app)
      .get('/users')
      .set('jwt', token)
      .expect(200);

    expect(resLoggedIn.body.users.length).toEqual(1);
    const newUser = resLoggedIn.body.users[0];
    expect(newUser.email).toEqual('dreamer@example.com');
  });

  it('returns logged in user details at /me with valid jwt', async () => {
    const user = await createUser({ email: 'dreamer@example.com ' });
    const token = jwt.sign({ currentUserId: user.id }, process.env.JWT_SECRET);

    const resInvalid = await request(app)
      .get('/users/me')
      .set('jwt', token + 'invalid')
      .expect(404);

    expect(resInvalid.body).toEqual({ error: { status: 404 }, message: 'Not Found' });

    const resValid = await request(app)
      .get('/users/me')
      .set('jwt', token)
      .expect(200);

    expect(resValid.body.user.email).toEqual('dreamer@example.com');
  });
});
