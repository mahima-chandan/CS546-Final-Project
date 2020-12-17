const c = require('../config');
const express = require('express');
const path = require('path');
const router = express.Router();
const {bets, lines, settings, simulator} = require('../data');

router.use((req, res, next) => {
  console.log("admin.js req.session.AuthCookie: " + req.session.AuthCookie);
  if (!req.session.AuthCookie)
    res.redirect('/');
  else
    next();
});

router.delete('/bets', async (req, res, next) => {
  try {
    await bets.deleteAll();
    res.status(200).send();
  }
  catch (e) {
    await console.log(4);
    await console.log(e);
    next(e);
  }
});

router.get('/', async (req, res) => {
  try {
    res.render('admin', {simdate: await settings.getSimDate(), 
                         cssOverrides: "admin.css",
                         title: "Admin page"});
  }
  catch (e) {
    res.status(500).send(`route: / ${e}`);
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
    res.status(500).send(`route: / ${e}`);
  }
});

router.put('/resolveBets', async (req, res) => {
  try {
    await bets.resolve();
    res.status(204).send();
  }
  catch (e) {
    res.status(500).send(`route: / ${e}`);
  }
});

router.post('/generateBets', async (req, res) => {
  try {
    const r = await simulator.generateBets();
    res.status(r.status).json(r);
  }
  catch (e) {
    res.status(500).send(`generateBets: / ${e}`);
  }
});

router.get('/housetake', async (req,res) =>{
  try {
    res.render('househistory', {})
  }
  catch (e) {
    res.status(500).send(`route: / ${e}`)
  }
})

module.exports = router;

