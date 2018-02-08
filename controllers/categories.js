const Categories = require('../models/categories');
const categorySerializer = require('../serializers/categories');

exports.index = async (req, res, next) => {
  let categories = await Categories.all();

  const serializedCategoriess = categories.map(category => categorySerializer(category));
  res.json({ categories: await Promise.all(serializedCategoriess) });
};

exports.create = async (req, res, next) => {
  const category = await Categories.create(req.body);
  if (category.errors) {
    res.json({ category });
  } else {
    const serializedCategories = await categorySerializer(category);
    res.json({ category: serializedCategories });
  }
};

exports.update = async (req, res, next) => {
  const properties = {
    ...req.body,
    ...{ id: req.params.id },
  };
  const updatedCategory = await Categories.update(properties);

  if (updatedCategory.errors) {
    res.json({ category: updatedCategory });
  }
  else {
    const serializedCategories = await categorySerializer(updatedCategory);
    res.json({ category: serializedCategories });
  }
};

