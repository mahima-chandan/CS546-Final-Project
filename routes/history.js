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
    const cur = await bets.getByUserId(req.session.user._id);
    const x = await cur.toArray();
    const totals = await bets.getTotalsByUserID(req.session.user._id)
    res.render('history', {title: "Betting History", bets: x, totals: totals, cssOverrides: "history.css"}); 
  } catch (e) {
    res.status(500).send(`route: / ${e}`);
  }
});

module.exports = router;

