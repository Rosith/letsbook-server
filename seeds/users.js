if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const clearDB = require('../lib/clearDB');
const User = require('../models/user');

clearDB().then(async () => {
  //To Do: Need to be removed
  const superUser = await User.create({
    firstName: 'Super',
    lastName: 'User',
    email: 'super.user@example.com',
    mobile: 1234567890,
    admin: true,
    role: 1,
    password: 'password',
  });

  const subUser = await User.create({
    firstName: 'Sub',
    lastName: 'User',
    email: 'sub.user@example.com',
    mobile: 1234567890,
    role: 2,
    password: 'password',
  });

  const users = [superUser, subUser];

  /* eslint-disable no-console */
  console.log(`Created users: ${ users.map( user => user.firstName ).join(', ') }`);
  /* eslint-enable no-console */

  await process.exit();
});
