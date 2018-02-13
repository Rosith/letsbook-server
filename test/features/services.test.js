const expect = require('expect');
const request = require('supertest');

require('../helpers/testSetup');

const app = require('../../app');
const createService = require('../helpers/objectCreationMethods').createService;

describe('Services', () => {
  it('can be listed for any user', async () => {
    const service = await createService();
    const resServices = await request(app)
      .get('/services')
      .expect(200);

    expect(resServices.body.services.length).toEqual(1);

    const newService = resServices.body.services[0];
    expect(newService.id).not.toBe(undefined);
    expect(newService).toEqual({
      id: service.id,
      categoryId: service.categoryId,
      name: service.name,
      description: service.description,
      active: service.active,
    });

    expect(newService.createdAt).toEqual(undefined);
    expect(newService.updatedAt).toEqual(undefined);
  });
});
