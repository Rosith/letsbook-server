const expect = require('expect');
const jwt = require('jsonwebtoken');

require('../helpers/testSetup');

const currentUser = require('../../lib/currentUser');

const User = require('../../models/user');

const userSerializer = require('../../serializers/user');

describe('currentUser', () => {
  it('returns a User when passed a valid token', async () => {
    const createdUser = await User.create({
      firstName: 'Mercedez',
      lastName: 'Goodman',
      email: 'Goodman@example.com',
      password: 'password',
    });
    const serializedUser = await userSerializer(createdUser);
    const validToken = jwt.sign(
      { currentUserId: createdUser.id },
      process.env.JWT_SECRET
    );

    const user = await currentUser(validToken);
    expect(user).toEqual({ ...serializedUser });
  });

  it('returns undefined when passed an invalid token', async () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

    const user = await currentUser(invalidToken);
    expect(user).toEqual(undefined);
  });
});
