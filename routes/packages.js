const express = require('express');
const router = express.Router();

const packagesController = require('../controllers/packages');

const verifyAdmin = require('../lib/verifyAdmin');
const verifyLoggedInUser = require('../lib/verifyLoggedInUser');

router.get('/', packagesController.index);
router.use(verifyLoggedInUser);
router.use(verifyAdmin);
router.put('/:id', packagesController.update);
router.post('/', packagesController.create);

module.exports = router;
