const expect = require('expect');
const request = require('supertest');

require('../helpers/testSetup');

const app = require('../../app');

const createCustomer = require('../helpers/objectCreationMethods').createCustomer;

describe('Customers', () => {
  it('can be listed', async () => {
    const customer = await createCustomer();

    const response = await request(app)
      .get('/customers')
      .expect(200);

    expect(response.body.customers.length).toEqual(1);

    const newCustomer = response.body.customers[0];
    expect(newCustomer.id).not.toBe(undefined);
    expect(newCustomer).toEqual({
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      mobile: customer.mobile,
    });

    expect(newCustomer.passwordDigest).toEqual(undefined);
    expect(newCustomer.createdAt).toEqual(undefined);
    expect(newCustomer.updatedAt).toEqual(undefined);
  });

});
