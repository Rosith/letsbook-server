module.exports = async packages => {
  const serialized = {
    id: packages.id,
    serviceId: packages.serviceId,
    name: packages.name,
    description: packages.description,
    active: packages.active,
  };

  return serialized;
};
