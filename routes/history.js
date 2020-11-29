const c = require('../config');
const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.render('history', {});
  }
  catch (e) {
    res.status(400).send(`route: / ${e}`);
  }
});

module.exports = router;

