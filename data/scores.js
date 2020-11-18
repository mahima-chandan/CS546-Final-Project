const axios = require('axios');
const c = require('../config');
const {db} = require('../config');
const {ObjectID} = require('mongodb');

// ----------------------------------------------------------------------------
// Logic in this file is very specific to and dependent upon access to the
// following scoresURL.
// ----------------------------------------------------------------------------

const scoresURL = `https://www.pro-football-reference.com/years/${c.year}`;

async function seed() {
  const scores = await db.scores();
  await scores.deleteMany({});
  for (let i = 1; i < 18; ++i)
    await seedWeek(i);
}

// ----------------------------------------------------------------------------
// getScoresByWeek will return an empty array if no scores have been posted
// for the given week. In this case of an empty array, don't call
// insertMany as it will error out.
// ----------------------------------------------------------------------------

async function seedWeek(nWeek) {
  const obj = await getScoresByWeek(nWeek);
  if (!obj.length)
    return;
  const scores = await db.scores();

  var rename_id = function(x) {
    x._id = x.gameid;
    delete x.gameid;
    return x;
  }
  await scores.insertMany(obj.map(rename_id));
}

// ----------------------------------------------------------------------------
// Takes integer week as String or Number.
// Returns an array of Objects, each Object representing a game and its
// final score (example):
//
//   {gameid: 'oti-mia-20201109',
//    awayTeam: 'oti',
//    awayScore: 38,
//    homeTeam: 'mia',
//    homeScore: 27}
//
// If no scores are found an empty array is returned. Meaning, this does not
// return games that have not been played. If a game has no score it is not
// returned, because their is no date yet recorded for these games and it
// gets difficult to determine what the date should be. So, best not to return
// anything about the game if there is no score yet posted for the game.
// ----------------------------------------------------------------------------

async function getScoresByWeek(week) {
  const obj = await axios.get(`${scoresURL}/week_${week}.htm`);
  let s = obj.data;
  let i = s.indexOf('id="all_potw"');
  if (i > 0)
    s = s.substring(0, i);
  let gameBatches = s.split('table class="teams"');
  let scores = [];
  for (let i = 1; i < gameBatches.length; ++i) {
    let score = doGameBatch(gameBatches[i], week);
    if (score)
      scores.push(score);
  }
  return scores; 
}

// ----------------------------------------------------------------------------
// If date comes back as either empty, or just a day of the week e.g.
// 'Monday', then that is taken to mean the score is not available so just
// return null back to the caller. Score not available means either the game
// has not been yet played or is in progress, or it has been played but has
// not been recorded yet.
// ----------------------------------------------------------------------------

function doGameBatch(batch, week) {
  let Ls = batch.split("\n");
  let rsf = {};
  for (let i = 0; i < Ls.length; ++i) {
    let line = Ls[i];
    if (line.indexOf('class="date"') > 0) {
      let date = line.replace(/^.*td colspan=3>/, '')
                     .replace(/<\/td.*$/, '');
      if (!date || date.indexOf(',') === -1)
        return null;
      rsf.gameDate = new Date(date).toISOString().substring(0, 10);
      rsf.week = week;
    } else if (line.indexOf("winner") > 0)
      rsf = doScore(Ls.slice(i, i + 7), rsf);
    else if (line.indexOf("loser") > 0)
      rsf = doScore(Ls.slice(i, i + 7), rsf);
  }

  rsf.gameid = rsf.awayTeam + "-" + rsf.homeTeam + "-" + rsf.gameDate;
  return rsf;
}

function doScore(lines, rsf) {
  for (let i = 0; i < lines.length; ++i) {
    let line = lines[i];
    if (line.indexOf('href="/teams/') > 0) {
      let team = line.replace(/^.*\/teams\//, '')
                     .replace(/\/.*$/, '');
      line = lines[i + 1];
      line = line.replace(/^.*right">/, '')
                 .replace(/<\/td>.*$/, '')
      let score = line ? Number(line) : null;
      if (!rsf.awayTeam) {
        rsf.awayTeam = convert(team);
        rsf.awayScore = score;
      }
      else {
        rsf.homeTeam = convert(team);
        rsf.homeScore = score;
      }
      break;
    }
  }
  return rsf;
}

// ----------------------------------------------------------------------------
// Converts team abbreviation into standard for the system.
// ----------------------------------------------------------------------------

function convert(team) {
  const lookup = {
    htx: 'hou',
    kan: 'kc',
    nyj: 'nyj',
    buf: 'buf',
    sea: 'sea',
    atl: 'atl',
    phi: 'phi',
    was: 'wsh',
    cle: 'cle',
    rav: 'bal',
    mia: 'mia',
    nwe: 'ne',
    gnb: 'gb',
    min: 'min',
    clt: 'ind',
    jax: 'jax',
    chi: 'chi',
    det: 'det',
    rai: 'lv',
    car: 'car',
    sdg: 'lac',
    cin: 'cin',
    crd: 'ari',
    sfo: 'sf',
    tam: 'tb',
    nor: 'no',
    dal: 'dal',
    ram: 'lar',
    pit: 'pit',
    nyg: 'nyg',
    oti: 'ten',
    den: 'den'
  };
  const result = lookup[team];
  if (!result)
    throw `convert ${team} not found`;
  return result;
}

module.exports = {
  seed
};
