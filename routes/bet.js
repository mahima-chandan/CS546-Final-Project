const c = require('../config');
const express = require('express');
const path = require('path');
const router = express.Router();
//const {bets, lines} = require('../data');
const {bets} = require('../data');
const allLines = [
  {
    "gameTime": "8:20 PM",
    "gameDate": "Thursday, November 19",
    "gameDateJulian": 1605835200000,
    "lineDate": "20201117221505",
    "awayShort": "ari",
    "awayML": 150,
    "awayPts": 3,
    "awayOE": 57.5,
    "awayLong": "Arizona Cardinals",
    "homeShort": "sea",
    "homeML": -170,
    "homePts": -3,
    "homeOE": 57.5,
    "homeLong": "Seattle Seahawks"
  },
  {
    "gameTime": "1:00 PM",
    "gameDate": "Sunday, November 22",
    "gameDateJulian": 1606068000000,
    "lineDate": "20201117221505",
    "awayShort": "phi",
    "awayML": 160,
    "awayPts": 3.5,
    "awayOE": 45.5,
    "awayLong": "Philadelphia Eagles",
    "homeShort": "cle",
    "homeML": -180,
    "homePts": -3.5,
    "homeOE": 45.5,
    "homeLong": "Cleveland Browns"
  },
  ];

router.get('/', async (req, res) => {
  try {
    //let allLines = await lines.get();
    res.render('bet', {allLines:allLines});
    console.log(allLines);
  }
  catch (e) {
    res.status(500).send(`route: / ${e}`);
  }
});

router.post('/', async (req, res) => {
  try {
    //console.log(req.body);
    const x = await bets.submitPanel(req.body);
    res.status(x.status).send(x);
  }
  catch (e) {
    res.status(500).send(`route: / ${e}`);
  }
});

module.exports = router;

