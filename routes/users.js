const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');
const verifyAdmin = require('../lib/verifyAdmin');
const verifyLoggedInUser = require('../lib/verifyLoggedInUser');
const verifySelfOrAdmin = require('../lib/verifySelfOrAdmin');

router.use(verifyLoggedInUser);
router.get('/me', usersController.me);
router.get('/', usersController.index);
router.get('/:id', usersController.show);

router.use('/:id', verifySelfOrAdmin);
router.put('/:id', usersController.update);

router.use(verifyAdmin);
router.post('/', usersController.create);

module.exports = router;
