const c = require('../config');
const express = require('express');
const path = require('path');
const router = express.Router();
const {bets} = require('../data');

router.get('/', async (req, res) => {
  try {
    const cur = await bets.getByUserId("aeeb758c75ee6029745ca8a0");
    const x = await cur.toArray();
<<<<<<< HEAD
    res.render('history', {bets: x, cssOverrides: "history.css"}); 
  } catch (e) {
=======
    const totals = await bets.getTotalsByUserID("aeeb758c75ee6029745ca8a0")
    res.render('history', {bets: x, totals: totals, cssOverrides: "history.css"}); 
  }
  catch (e) {
>>>>>>> 94896ace22acb9865bea3892e02fad3b57b8214a
    res.status(500).send(`route: / ${e}`);
  }
});

module.exports = router;

