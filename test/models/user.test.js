const expect = require('expect');

require('../helpers/testSetup');

const User = require('../../models/user');

describe('User', () => {
  it('can be created', async () => {
    const usersBefore = await User.all();
    expect(usersBefore.length).toBe(0);

    await User.create({
      firstName: 'Mercedez',
      lastName: 'Goodman',
      email: 'mercedez@example.com',
      admin: true,
      role: 1,
      mobile: 1234567890,
      password: 'password',
    });
    const usersAfter = await User.all();
    expect(usersAfter.length).toBe(1);
    expect(usersAfter[0].firstName).toBe('Mercedez');
    expect(usersAfter[0].lastName).toBe('Goodman');
    expect(usersAfter[0].email).toBe('mercedez@example.com');
    expect(usersAfter[0].admin).toBe(true);
    expect(usersAfter[0].role).toBe(1);
  });

  it('must have email, password, firstName, lastName, hireDate', async () => {
    const user = await User.create({});
    expect(user).toEqual({ errors: [
      'Email cannot be blank',
      'First Name cannot be blank',
      'Last Name cannot be blank',
      'Password cannot be blank',
    ] });
  });

  it('must have unique email and cognizantId to be created', async () => {
    await User.create({
      firstName: 'Mercedez',
      lastName: 'Goodman',
      email: 'mercedez@example.com',
      admin: true,
      role: 1,
      mobile: 1234567890,
      password: 'password',
    });
    const duplicateUser = await User.create({
      firstName: 'Mercedez',
      lastName: 'Goodman',
      email: 'mercedez@example.com',
      admin: true,
      role: 1,
      mobile: 1234567890,
      password: 'password',
    });

    expect(duplicateUser).toEqual({ errors: [
      'Email already taken',
    ] });
    const users = await User.all();
    expect(users.length).toBe(1);
  });

  it('can be updated', async () => {
    const originalUser = await User.create({
      firstName: 'Mercedez',
      lastName: 'Goodman',
      email: 'mercedez@example.com',
      admin: true,
      role: 1,
      mobile: 1234567890,
      password: 'password',
    });
    const updatedUser = await User.update({
      id: originalUser.id,
      firstName: 'Herschel',
      lastName: 'Ammons',
      email: 'ammons@example.com',
      admin: true,
      role: 1,
      mobile: 1994567890,
      password: 'password',
    });

    expect(updatedUser.firstName).toBe('Herschel');
    expect(updatedUser.lastName).toBe('Ammons');
    expect(updatedUser.email).toBe('ammons@example.com');
    expect(updatedUser.admin).toBe(true);
    expect(updatedUser.role).toEqual(1);
    expect(updatedUser.passwordDigest).not.toBe(originalUser.passwordDigest);
  });

  it('removes whitespace and down case email on create/update', async () => {
    const user = await User.create({
      firstName: 'Christel',
      lastName: 'Lippman',
      email: '  ChristelLippman@example.com ',
      password: 'password',
    });

    expect(user.email).toEqual('christellippman@example.com');
  });

  it('must have unique email to be updated', async () => {
    const firstUser = await User.create({
      firstName: 'Christel',
      lastName: 'Lippman',
      admin: true,
      role: 1,
      mobile: 1994567890,
      email: 'christellippman@example.com',
      password: 'password',
    });
    const secondUser = await User.create({
      firstName: 'Herschel',
      lastName: 'Ammons',
      email: 'ammons@example.com',
      role: 3,
      mobile: 1994567890,
      password: 'password',
    });
    const updateSecondUser = await User.update({
      id: secondUser.id,
      firstName: 'Jayna',
      lastName: 'Tippins',
      email: firstUser.email,
      password: 'password',
    });

    expect(updateSecondUser).toEqual({ errors: [
      'Email already taken',
    ] });
    const secondUserRecord = await User.find(secondUser.id);
    expect(secondUserRecord.email).toEqual('ammons@example.com');
  });

  it('can update user using same email address', async () => {
    const user = await User.create({
      firstName: 'Herschel',
      lastName: 'Ammons',
      email: 'ammons@example.com',
      mobile: 1994567890,
      password: 'password',
    });

    const updatedUser = await User.update({
      id: user.id,
      firstName: 'Jayna',
      lastName: 'Tippins',
      email: 'ammons@example.com',
    });

    expect(updatedUser.firstName).toEqual(updatedUser.firstName);
    expect(updatedUser.email).toEqual(user.email);
  });

  it('can be found by id', async () => {
    const user = await User.create({
      firstName: 'Herschel',
      lastName: 'Ammons',
      email: 'ammons@example.com',
      mobile: 1994567890,
      password: 'password',
    });

    const foundUser = await User.find(user.id);
    expect(foundUser.firstName).toEqual('Herschel');
    expect(foundUser.lastName).toEqual('Ammons');
    expect(foundUser.email).toEqual('ammons@example.com');
  });

  it('can be found by email', async () => {
    await User.create({
      firstName: 'Herschel',
      lastName: 'Ammons',
      email: 'ammons@example.com',
      mobile: 1994567890,
      password: 'password',
    });

    const foundUserByEmail = await User.findBy({ email: 'ammons@example.com' });
    expect(foundUserByEmail.firstName).toEqual('Herschel');
    expect(foundUserByEmail.lastName).toEqual('Ammons');
    expect(foundUserByEmail.email).toEqual('ammons@example.com');
  });
});
