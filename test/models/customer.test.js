const expect = require('expect');

require('../helpers/testSetup');

const Customers = require('../../models/customers');

describe('Customers', () => {
  it('can be created', async () => {
    const customersBefore = await Customers.all();
    expect(customersBefore.length).toBe(0);

    await Customers.create({
      firstName: 'Mercedez',
      lastName: 'Goodman',
      email: 'mercedez@example.com',
      mobile: 1234567890,
      password: 'password',
    });
    const usersAfter = await Customers.all();
    expect(usersAfter.length).toBe(1);
    expect(usersAfter[0].firstName).toBe('Mercedez');
    expect(usersAfter[0].lastName).toBe('Goodman');
    expect(usersAfter[0].email).toBe('mercedez@example.com');
  });

  it('must have email, firstName, lastName, hireDate', async () => {
    const user = await Customers.create({});
    expect(user).toEqual({ errors: [
      'Email cannot be blank',
      'First Name cannot be blank',
      'Last Name cannot be blank',
    ] });
  });

  it('must have unique email to be created', async () => {
    await Customers.create({
      firstName: 'Mercedez',
      lastName: 'Goodman',
      email: 'mercedez@example.com',
      mobile: 1234567890,
      password: 'password',
    });
    const duplicateCustomers = await Customers.create({
      firstName: 'Mercedez',
      lastName: 'Goodman',
      email: 'mercedez@example.com',
      mobile: 1234567890,
      password: 'password',
    });

    expect(duplicateCustomers).toEqual({ errors: [
      'Email already taken',
      'Mobile already taken',
    ] });
    const users = await Customers.all();
    expect(users.length).toBe(1);
  });

  it('can be updated', async () => {
    const originalCustomers = await Customers.create({
      firstName: 'Mercedez',
      lastName: 'Goodman',
      email: 'mercedez@example.com',
      mobile: 1234567890,
      password: 'password',
    });
    const updatedCustomers = await Customers.update({
      id: originalCustomers.id,
      firstName: 'Herschel',
      lastName: 'Ammons',
      email: 'ammons@example.com',
      mobile: 1994567890,
      password: 'password',
    });

    expect(updatedCustomers.firstName).toBe('Herschel');
    expect(updatedCustomers.lastName).toBe('Ammons');
    expect(updatedCustomers.email).toBe('ammons@example.com');
    expect(updatedCustomers.passwordDigest).not.toBe(originalCustomers.passwordDigest);
  });

  it('removes whitespace and down case email on create/update', async () => {
    const user = await Customers.create({
      firstName: 'Christel',
      lastName: 'Lippman',
      email: '  ChristelLippman@example.com ',
      password: 'password',
    });

    expect(user.email).toEqual('christellippman@example.com');
  });

  it('must have unique email and mobile to be updated', async () => {
    const firstCustomers = await Customers.create({
      firstName: 'Christel',
      lastName: 'Lippman',
      mobile: 1994567890,
      email: 'christellippman@example.com',
      password: 'password',
    });
    const secondCustomers = await Customers.create({
      firstName: 'Herschel',
      lastName: 'Ammons',
      email: 'ammons@example.com',
      mobile: 1994567891,
      password: 'password',
    });
    const updateSecondCustomers = await Customers.update({
      id: secondCustomers.id,
      firstName: 'Jayna',
      lastName: 'Tippins',
      email: firstCustomers.email,
      mobile: firstCustomers.mobile,
      password: 'password',
    });

    expect(updateSecondCustomers).toEqual({ errors: [
      'Email already taken',
      'Mobile already taken',
    ] });
    const secondCustomersRecord = await Customers.find(secondCustomers.id);
    expect(secondCustomersRecord.email).toEqual('ammons@example.com');
    expect(secondCustomersRecord.mobile).toEqual('1994567891');
  });

  it('can update user using same email address', async () => {
    const user = await Customers.create({
      firstName: 'Herschel',
      lastName: 'Ammons',
      email: 'ammons@example.com',
      mobile: 1994567890,
      password: 'password',
    });

    const updatedCustomers = await Customers.update({
      id: user.id,
      firstName: 'Jayna',
      lastName: 'Tippins',
      email: 'ammons@example.com',
    });

    expect(updatedCustomers.firstName).toEqual(updatedCustomers.firstName);
    expect(updatedCustomers.email).toEqual(user.email);
  });

  it('can be found by id', async () => {
    const user = await Customers.create({
      firstName: 'Herschel',
      lastName: 'Ammons',
      email: 'ammons@example.com',
      mobile: 1994567890,
      password: 'password',
    });

    const foundCustomers = await Customers.find(user.id);
    expect(foundCustomers.firstName).toEqual('Herschel');
    expect(foundCustomers.lastName).toEqual('Ammons');
    expect(foundCustomers.email).toEqual('ammons@example.com');
  });

  it('can be found by email', async () => {
    await Customers.create({
      firstName: 'Herschel',
      lastName: 'Ammons',
      email: 'ammons@example.com',
      mobile: 1994567890,
      password: 'password',
    });

    const foundCustomersByEmail = await Customers.findBy({ email: 'ammons@example.com' });
    expect(foundCustomersByEmail.firstName).toEqual('Herschel');
    expect(foundCustomersByEmail.lastName).toEqual('Ammons');
    expect(foundCustomersByEmail.email).toEqual('ammons@example.com');
  });
});
