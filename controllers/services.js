const Services = require('../models/services');
const serviceSerializer = require('../serializers/services');

exports.index = async (req, res, next) => {
  let services = await Services.all();
  const serializedServicess = services.map(service => serviceSerializer(service));

  res.json({ services: await Promise.all(serializedServicess) });
};

exports.create = async (req, res, next) => {
  const service = await Services.create(req.body);
  if (service.errors) {
    res.json({ service });
  } else {
    const serializedServices = await serviceSerializer(service);
    res.json({ service: serializedServices });
  }
};

exports.update = async (req, res, next) => {
  const properties = {
    ...req.body,
    ...{ id: req.params.id },
  };
  const updatedCategory = await Services.update(properties);

  if (updatedCategory.errors) {
    res.json({ service: updatedCategory });
  }
  else {
    const serializedServices = await serviceSerializer(updatedCategory);
    res.json({ service: serializedServices });
  }
};

