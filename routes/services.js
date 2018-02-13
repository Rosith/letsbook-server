const express = require('express');
const router = express.Router();

const servicesController = require('../controllers/services');
const verifyAdmin = require('../lib/verifyAdmin');
const verifyLoggedInUser = require('../lib/verifyLoggedInUser');

router.get('/', servicesController.index);
router.use(verifyLoggedInUser);
router.use(verifyAdmin);
router.put('/:id', servicesController.update);
router.post('/', servicesController.create);

module.exports = router;
