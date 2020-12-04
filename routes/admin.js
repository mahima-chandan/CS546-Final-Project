const c = require('../config');
const express = require('express');
const path = require('path');
const router = express.Router();
const {bets, settings} = require('../data');

router.delete('/bets', async (req, res) => {
  await bets.deleteAll();
  res.status(200).send();
});

router.get('/', async (req, res) => {
  try {
    res.render('admin', {simdate: await settings.getSimDate(), 
                         title: "Admin page"});
  }
  catch (e) {
    res.status(400).send(`route: / ${e}`);
  }
});

router.put('/simdate', async (req, res) => {
  try {
    const {simdate} = req.body;
    console.log("saving simdate " + simdate + " to settings");
    await settings.saveSimDate(simdate);
    res.status(204).send();
  }
  catch (e) {
    res.status(400).send(`route: / ${e}`);
  }
});

module.exports = router;

