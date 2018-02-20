const Customer = require('../models/customers');
const customerSerializer = require('../serializers/customers');

exports.index = async (req, res, next) => {
  let customers;
  customers = await Customer.all();

  const serializedCustomers = customers.map(customer => customerSerializer(customer));
  res.json({ customers: await Promise.all(serializedCustomers) });
};

exports.create = async (req, res, next) => {
  const customer = await Customer.create(req.body);
  if (customer.errors) {
    res.json({ customer });
  } else {
    const serializedCustomer = await customerSerializer(customer);
    res.json({ customer: serializedCustomer });
  }
};

exports.show = async (req, res, next) => {
  try {
    const customer = await Customer.find(req.params.id);
    const serializedCustomer = await customerSerializer(customer);
    res.json({ customer: serializedCustomer });
  } catch (e) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
};
