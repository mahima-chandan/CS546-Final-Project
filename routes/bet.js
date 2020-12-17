const c = require('../config');
const express = require('express');
const path = require('path');
const router = express.Router();
const {bets, lines} = require('../data');
const allLines = [
  {
    "gameid": "ari-sea-2020-11-19",
    "gameTime": "8:20 PM",
    "gameDate": "Thursday, November 19",
    "gameDateJulian": 1605835200000,
    "lineDate": "20201117221505",
    "awayShort": "ari",
    "awayML": 150,
    "awayPts": 3,
    "under": 57.5,
    "awayLong": "Arizona Cardinals",
    "homeShort": "sea",
    "homeML": -170,
    "homePts": -3,
    "over": 57.5,
    "homeLong": "Seattle Seahawks"
  },
  {
    "gameid": "phi-cle-2020-11-19",
    "gameTime": "1:00 PM",
    "gameDate": "Sunday, November 22",
    "gameDateJulian": 1606068000000,
    "lineDate": "20201117221505",
    "awayShort": "phi",
    "awayML": 160,
    "awayPts": 3.5,
    "under": 45.5,
    "awayLong": "Philadelphia Eagles",
    "homeShort": "cle",
    "homeML": -180,
    "homePts": -3.5,
    "over": 45.5,
    "homeLong": "Cleveland Browns"
  },
  ];

router.use((req, res, next) => {
  console.log("bet.js req.session.AuthCookie: " + req.session.AuthCookie);
  if (!req.session.AuthCookie)
    res.redirect('/');
  else
    next('route');
});

router.get('/', async (req, res) => {
  try {
    let allLines = await lines.get();
    res.render('bet', {allLines: allLines,
                       cssOverrides: "bet.css"});
  }
  catch (e) {
    res.status(500).send(`route: / ${e}`);
  }
});

router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    console.log("bets incoming from " + req.session.user.username);
    const x = await bets.submitPanel(req.session.user._id, req.body);
    res.status(x.status).send(x);
  }
  catch (e) {
    res.status(500).send(`route: / ${e}`);
  }
});

module.exports = router;

