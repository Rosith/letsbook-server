const expect = require('expect');
const request = require('supertest');

require('../helpers/testSetup');

const app = require('../../app');
const createPackage = require('../helpers/objectCreationMethods').createPackage;

describe('Packages', () => {
  it('can be listed for any user', async () => {
    const servicePack = await createPackage();

    const resPackages = await request(app)
      .get('/packages')
      .expect(200);
    expect(resPackages.body.packages.length).toEqual(1);

    const newService = resPackages.body.packages[0];
    expect(newService.id).not.toBe(undefined);
    expect(newService).toEqual({
      id: servicePack.id,
      serviceId: servicePack.serviceId,
      name: servicePack.name,
      description: servicePack.description,
      active: servicePack.active,
    });

    expect(newService.createdAt).toEqual(undefined);
    expect(newService.updatedAt).toEqual(undefined);
  });
});
