const c = require('../config');
const express = require('express');
const fs = require('fs-extra');
const router = express.Router();
const {lines} = require('../data');

console.log(lines.parse);

router.get('/nfl', async (req, res) => {
  try {
    const currentLines = await lines.get();
    res.json(currentLines.filter(x => { return x }));
  }
  catch (e) {
    res.status(400).send(`route: /nfl/week/:week ${e}`);
  }
});

module.exports = router;
