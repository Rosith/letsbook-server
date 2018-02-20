const express = require('express');
const router = express.Router();

const customersController = require('../controllers/customers');

router.post('/', customersController.create);
router.get('/', customersController.index);
router.get('/:id', customersController.show);

module.exports = router;
