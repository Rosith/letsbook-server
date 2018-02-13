module.exports = async services => {
  const serialized = {
    id: services.id,
    categoryId: services.categoryId,
    name: services.name,
    description: services.description,
    active: services.active,
  };

  return serialized;
};
