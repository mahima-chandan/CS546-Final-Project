const axios = require('axios');
const c = require('../config');
const express = require('express');
const fs = require('fs-extra');
const router = express.Router();

let gameDate = null,
    gameTime = null,
    lines = [];

router.get('/nfl', async (req, res) => {
  try {
    const obj = await axios.get('https://www.espn.com/nfl/lines');
    let s = obj.data;
    i = s.indexOf("HeaderScoreboardWrapper")
    s = s.substring(i, i + 90000);

    let batches = s.split('margin-subtitle"');
    for (let i = 1; i < batches.length; ++i)
      await doMSBatch(batches[i]);
    res.json(lines.filter(x => { return x }));
  }
  catch (e) {
    res.status(400).send(`route: /nfl/week/:week ${e}`);
  }
});

async function doMSBatch(batch) {
  let x = batch.substring(0, 32);3
  gameDate = x.replace(/<\/div.*$/, '');
  gameDate = gameDate.substring(1);
  let batches = batch.split('Table__TH"');
  for (let i = 0; i < batches.length; ++i)
    await doTHBatch(batches[i]);
}

async function doTHBatch(batch) {
  if (batch.search(/^>.*:.* PM/) == 0) {
    batch = batch.replace(/PM<\/.*$/, "PM");
    gameTime = batch.substring(1);
    return;
  }
  if (batch.search(/^>FPI/) == 0)
    lines.push(await doGameBatch(batch));
}

// first item of the batch is where I extract the date from, to use on all
// the other items in the batch. Skip further processing on this first item after
// the split on team/_/name since first items only role is to provide
// the game date.

async function doGameBatch(batch) {
  try {
    let batches = batch.split('nfl/team/');
    let a2 = [];
    for (let i = 0; i < batches.length; ++i) {
      let s = batches[i];
      if (s.indexOf("Image Logo") > 0)
        continue;
      if (s.indexOf(">FPI") == 0)
        continue;
      if (s.indexOf("shortName") > 0)
        continue;
      s = s.substring(0, 1000);
      s = s.replace(/%<\/td.*$/, '');
      s = s.replace(/<\/td><td class="Table__TD">/g, " ");
      s = s.replace(/_\/name\//, "");
      s = s.replace(/\/.*">/, " ");
      s = s.replace(/<\/a><\/div>/, "");
      a2.push(s);
    }

    var awayPts, homePts, awayOE, homeOE, awayLong, homeLong;

    let aw = a2[0];
    aw = aw.replace(/%<.*$/, "");
    aw = aw.replace(/<\/a><\/div>/, " ");
    aw = aw.replace(/\/.*>/, " ");

    let ho = a2[1];

    let arec = aw.split(/  */);
    let hrec = ho.split(/  */);
    let alen = arec.length;
    let hlen = hrec.length;
    var awayPts, homePts, awayOE, homeOE, awayLong, homeLong;
    let awayML = Number(arec[alen - 2]);
    let homeML = Number(hrec[hlen - 2]);
    let awayShort = arec[0];
    let homeShort = hrec[0];

    switch (alen) {
    case 8:
      awayLong = arec[1];
      break;
    case 9:
      awayLong = arec[1] + ' ' + arec[2];
      break;
    case 10:
      awayLong = arec[1] + ' ' + arec[2] + ' ' + arec[3];
      break;
    default:
      throw `unrecognized format for ${arec}`;
    }
    awayLong = awayLong.trim();

    switch (hlen) {
    case 8:
      homeLong = hrec[1];
      break;
    case 9:
      homeLong = hrec[1] + ' ' + hrec[2];
      break;
    case 10:
      homeLong = hrec[1] + ' ' + hrec[2] + ' ' + hrec[3];
      break;
    default:
      throw `unrecognized format for ${hrec}`;
    }
    homeLong = homeLong.trim();

    if (arec[alen - 4] <= 0.0) {
      awayPts = Number(arec[alen - 4]);
      homePts = -awayPts;
      awayOE = Number(hrec[hlen - 4]);
      homeOE = awayOE;
    }
    else {
      awayPts = Number(-hrec[hlen - 4]);
      homePts = -awayPts;
      awayOE = Number(arec[alen - 4]);
      homeOE = awayOE;
    }

    let lineDate = new Date().toISOString();
    lineDate = lineDate.replace(/\..*$/, '')
                       .replace(/[-T:Z]/g, '');
    let gameDateJulian = new Date(gameDate + `, ${c.year} ` + gameTime).valueOf();
    return {gameTime: gameTime,
       gameDate,
       gameDateJulian,
       lineDate,
       awayShort,
       awayML,
       awayPts,
       awayOE,
       awayLong,
       homeShort,
       homeML,
       homePts,
       homeOE,
       homeLong};
  }
  catch (e) {
    console.log(e);
    console.log('gameBatch: ' + batch);
    return null;
  }
}

module.exports = router;
