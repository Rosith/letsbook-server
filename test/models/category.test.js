const expect = require('expect');

require('../helpers/testSetup');

const Categories = require('../../models/categories');

describe('Categories', () => {
  it('can be created!', async () => {
    const categoryBefore = await Categories.all();
    expect(categoryBefore.length).toBe(0);

    await Categories.create({
      name: 'AM',
      description: 'Auto mobile',
      active: true,
    });

    const categoryAfter = await Categories.all();
    expect(categoryAfter.length).toBe(1);
    expect(categoryAfter[0].name).toBe('AM');
    expect(categoryAfter[0].description).toBe('Auto mobile');
    expect(categoryAfter[0].active).toBe(true);
  });

  it('must have name, description', async () => {
    const user = await Categories.create({});
    expect(user).toEqual({ errors: [
      'Name cannot be blank',
      'Description cannot be blank',
    ] });
  });

  it('must have unique name', async () => {
    await Categories.create({
      name: 'Mercedez',
      description: 'Goodman',
      active: true,
    });
    const duplicateCategories = await Categories.create({
      name: 'Mercedez',
      description: 'Goodman',
      active: true,
    });

    expect(duplicateCategories).toEqual({ errors: [
      'Name already taken',
    ] });
    const categories = await Categories.all();
    expect(categories.length).toBe(1);
  });

  it('can be updated', async () => {
    const originalCategories = await Categories.create({
      name: 'Mercedez',
      description: 'Goodman',
      active: true,
    });
    const updatedCategories = await Categories.update({
      id: originalCategories.id,
      name: 'Herschel',
      description: 'Ammons',
    });

    expect(updatedCategories.name).toBe('Herschel');
    expect(updatedCategories.description).toBe('Ammons');
    expect(updatedCategories.active).toBe(true);
  });

});
