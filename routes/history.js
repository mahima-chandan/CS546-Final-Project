const c = require('../config');
const express = require('express');
const path = require('path');
const router = express.Router();
const {bets} = require('../data');

router.use((req, res, next) => {
  console.log("history.js req.session.AuthCookie: " + req.session.AuthCookie);
  if (!req.session.AuthCookie)
    res.redirect('/');
  else
    next();
});

router.get('/', async (req, res) => {
  try {
    const cur = await bets.getByUserId("aeeb758c75ee6029745ca8a0");
    const x = await cur.toArray();
    const totals = await bets.getTotalsByUserID("aeeb758c75ee6029745ca8a0")
    res.render('history', {title: "Betting History", bets: x, totals: totals, cssOverrides: "history.css"}); 
  } catch (e) {
    res.status(500).send(`route: / ${e}`);
  }
});

module.exports = router;

