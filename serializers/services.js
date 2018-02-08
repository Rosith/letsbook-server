module.exports = async services => {
  const serialized = {
    id: services.id,
    name: services.name,
    description: services.description,
    active: services.active,
  };
  return serialized;
};
