const c = require('../config');
const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.render('admin', {});
  }
  catch (e) {
    res.status(400).send(`route: / ${e}`);
  }
});

router.post('/', async (req, res) => {
  try {
// do something
  }
  catch (e) {
    res.status(400).send(`route: / ${e}`);
  }
});

module.exports = router;

