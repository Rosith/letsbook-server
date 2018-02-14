const Packages = require('../models/packages');
const packageSerializer = require('../serializers/packages');

exports.index = async (req, res, next) => {
  let packages = await Packages.all();
  const serializedPackagess = packages.map(servicePack => packageSerializer(servicePack));

  res.json({ packages: await Promise.all(serializedPackagess) });
};

exports.create = async (req, res, next) => {
  const servicePack = await Packages.create(req.body);
  if (servicePack.errors) {
    res.json({ servicePack });
  }
  else {
    const serializedPackages = await packageSerializer(servicePack);
    res.json({ servicePack: serializedPackages });
  }
};

exports.update = async (req, res, next) => {
  const properties = {
    ...req.body,
    ...{ id: req.params.id },
  };
  const updatedPackage = await Packages.update(properties);

  if (updatedPackage.errors) {
    res.json({ servicePack: updatedPackage });
  }
  else {
    const serializedPackages = await packageSerializer(updatedPackage);
    res.json({ servicePack: serializedPackages });
  }
};

