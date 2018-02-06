module.exports = async categories => {
  const serialized = {
    id: categories.id,
    name: categories.name,
    description: categories.description,
    active: categories.active,
  };
  return serialized;
};
