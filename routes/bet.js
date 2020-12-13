const c = require('../config');
const express = require('express');
const path = require('path');
const router = express.Router();
const {bets} = require('../data');

router.get('/', async (req, res) => {
  try {
    res.render('bet', {});
  }
  catch (e) {
    res.status(500).send(`route: / ${e}`);
  }
});

router.post('/', async (req, res) => {
  try {
    //console.log(req.body);
    const x = await bets.submitPanel(req.body);
    res.status(200).send(x);
  }
  catch (e) {
    res.status(500).send(`route: / ${e}`);
  }
});

module.exports = router;

