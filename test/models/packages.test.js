const expect = require('expect');

require('../helpers/testSetup');

const Packages = require('../../models/packages');
const createService = require('../helpers/objectCreationMethods').createService;

describe('Packages', () => {
  it('can be created!', async () => {
    const service = await createService();
    const packagesBefore = await Packages.all();
    expect(packagesBefore.length).toBe(0);
    await Packages.create({
      serviceId: service.id,
      name: 'wash',
      description: 'clean',
      active: true,
    });

    const servicesAfter = await Packages.all();
    expect(servicesAfter.length).toBe(1);
    expect(servicesAfter[0].name).toBe('wash');
    expect(servicesAfter[0].description).toBe('clean');
    expect(servicesAfter[0].active).toBe(true);
  });

  it('must have serviceId, name, description', async () => {
    const user = await Packages.create({});
    expect(user).toEqual({ errors: [
      'Service Id cannot be blank',
      'Name cannot be blank',
      'Description cannot be blank',
    ] });
  });

  it('must have unique name', async () => {
    const service = await createService();

    await Packages.create({
      serviceId: service.id,
      name: 'Mercedez',
      description: 'Goodman',
      active: true,
    });
    const duplicatePackages = await Packages.create({
      serviceId: service.id,
      name: 'Mercedez',
      description: 'Goodman',
      active: true,
    });

    expect(duplicatePackages).toEqual({ errors: [
      'Name already taken',
    ] });
    const services = await Packages.all();
    expect(services.length).toBe(1);
  });

  it('can be updated', async () => {
    const service = await createService();
    const originalPackages = await Packages.create({
      serviceId: service.id,
      name: 'Mercedez',
      description: 'Goodman',
      active: true,
    });
    const updatedPackages = await Packages.update({
      id: originalPackages.id,
      serviceId: originalPackages.serviceId,
      name: 'Herschel',
      description: 'Ammons',
    });

    expect(updatedPackages.name).toBe('Herschel');
    expect(updatedPackages.description).toBe('Ammons');
    expect(updatedPackages.active).toBe(true);
  });

});
