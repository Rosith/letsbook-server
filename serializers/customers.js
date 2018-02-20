module.exports = async customer => {
  const serialized = {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    mobile: customer.mobile,
  };
  return serialized;
};
