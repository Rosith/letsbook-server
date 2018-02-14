const expect = require('expect');
const jwt = require('jsonwebtoken');
const request = require('supertest');

require('../helpers/testSetup');

const app = require('../../app');

const createUser = require('../helpers/objectCreationMethods').createUser;
const createService = require('../helpers/objectCreationMethods').createService;

describe('Admin users', () => {
  it('are the only users who can create new Services', async () => {
    const admin = await createUser({
      admin: true,
    });

    const service = await createService();
    const newServiceAttributes = {
      serviceId: service.id,
      name: 'book keepint',
      description: 'keeping books',
      active: false,
    };

    const guestRes = await request(app)
      .post('/packages')
      .send(newServiceAttributes)
      .expect(404);

    expect(guestRes.body).toEqual({ error: { status: 404 }, message: 'Not Found' });

    const user = await createUser();
    const userToken = jwt.sign({ currentUserId: user.id }, process.env.JWT_SECRET);

    const userRes = await request(app)
      .post('/packages')
      .set('jwt', userToken)
      .send(newServiceAttributes)
      .expect(404);

    expect(userRes.body).toEqual({ error: { status: 404 }, message: 'Not Found' });

    const adminToken = jwt.sign({ currentUserId: admin.id }, process.env.JWT_SECRET);
    const adminRes = await request(app)
      .post('/packages')
      .set('jwt', adminToken)
      .send(newServiceAttributes)
      .expect(200);

    expect(adminRes.body.jwt).toEqual(undefined);
    expect(adminRes.body.servicePack.name).toBe(newServiceAttributes.name);
    expect(adminRes.body.servicePack.description).toBe(newServiceAttributes.description);
    expect(adminRes.body.servicePack.active).toBe(newServiceAttributes.active);
  });
});
