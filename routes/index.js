const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200);
  res.send('Letz Book');
});

module.exports = router;
