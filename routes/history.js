const c = require('../config');
const express = require('express');
const path = require('path');
const router = express.Router();
const {bets} = require('../data');

router.get('/', async (req, res) => {
  try {
    const cur = await bets.getByUserId("aeeb758c75ee6029745ca8a0");
    const x = await cur.toArray();
    res.render('history', {bets: x, cssOverrides: "history.css"}); 
  }
  catch (e) {
    res.status(500).send(`route: / ${e}`);
  }
});

module.exports = router;

