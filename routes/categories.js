const express = require('express');
const router = express.Router();

const categoriesController = require('../controllers/categories');
const verifyAdmin = require('../lib/verifyAdmin');
const verifyLoggedInUser = require('../lib/verifyLoggedInUser');

router.get('/', categoriesController.index);

router.use(verifyLoggedInUser);
router.use(verifyAdmin);
router.put('/:id', categoriesController.update);
router.post('/', categoriesController.create);

module.exports = router;
