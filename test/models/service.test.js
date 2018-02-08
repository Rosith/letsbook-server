const expect = require('expect');

require('../helpers/testSetup');

const Services = require('../../models/services');
const createCategory = require('../helpers/objectCreationMethods').createCategory;

describe('Services', () => {
  it('can be created!', async () => {
    const category = createCategory({});
    const servicesBefore = await Services.all();
    expect(servicesBefore.length).toBe(0);

    await Services.create({
      categoryId: category.id,
      name: 'wash',
      description: 'clean',
      active: true,
    });

    const servicesAfter = await Services.all();
    expect(servicesAfter.length).toBe(1);
    expect(servicesAfter[0].name).toBe('wash');
    expect(servicesAfter[0].description).toBe('clean');
    expect(servicesAfter[0].active).toBe(true);
  });

  it('must have categoryId, name, description', async () => {
    const user = await Services.create({});
    expect(user).toEqual({ errors: [
      'Category Id cannot be blank',
      'Name cannot be blank',
      'Description cannot be blank',
    ] });
  });

  it('must have unique name', async () => {
    const category = createCategory();

    await Services.create({
      categoryId: category.id,
      name: 'Mercedez',
      description: 'Goodman',
      active: true,
    });
    const duplicateServices = await Services.create({
      categoryId: category.id,
      name: 'Mercedez',
      description: 'Goodman',
      active: true,
    });

    expect(duplicateServices).toEqual({ errors: [
      'Name already taken',
    ] });
    const services = await Services.all();
    expect(services.length).toBe(1);
  });

  it('can be updated', async () => {
    const category = createCategory();
    const originalServices = await Services.create({
      categoryId: category.id,
      name: 'Mercedez',
      description: 'Goodman',
      active: true,
    });
    const updatedServices = await Services.update({
      id: originalServices.id,
      categoryId: originalServices.categoryId,
      name: 'Herschel',
      description: 'Ammons',
    });

    expect(updatedServices.name).toBe('Herschel');
    expect(updatedServices.description).toBe('Ammons');
    expect(updatedServices.active).toBe(true);
  });

});
