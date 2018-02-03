module.exports = async user => {
  const serialized = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
    admin: user.admin,
    role: user.role,
  };
  return serialized;
};
