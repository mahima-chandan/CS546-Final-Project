const c = require('../config');
const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.render('fund', {});
  }
  catch (e) {
    res.status(400).send(`route: / ${e}`);
  }
});

/* Mahima to develop this
router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    res.sendFile(path.resolve('public/bet.html'));
  }
  catch (e) {
    res.status(400).send(`route: / ${e}`);
  }
});
*/

module.exports = router;

