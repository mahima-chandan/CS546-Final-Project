const c = require('../config');
const {db} = require('../config');
const {ObjectID} = require('mongodb');
const lines = require('./lines');
const bets = require('./bets');

const users = require('./users');

// ----------------------------------------------------------------------------
// Using the passed in line, manufactures a simulated randomly-generated panel
// of bets against that game, and submits it to mongo via the bets module.
// ----------------------------------------------------------------------------

async function makeAndSubmitPanel(userid, line) {
  let nBets = randomInt(1, 7);
  let betTypes = new Set();
  for (var i = 0; i < nBets; ++i)
    betTypes.add(randomBetType());
  nBets = betTypes.size;
  const panel = {"gameid": line.gameid,
     "aspNum": null, 
     "aspBet": null,
     "aspWin": null,
     "aspCollect": null,
     "amlNum": null,
     "amlBet": null,
     "amlWin": null,
     "amlCollect": null,
     "hspNum": null,
     "hspBet": null,
     "hspWin": null,
     "hspCollect": null,
     "hmlNum": null,
     "hmlBet": null,
     "hmlWin": null,
     "hmlCollect": null,
     "overNum": null,
     "overBet": null,
     "overWin": null,
     "overCollect": null,
     "underNum": null,
     "underBet": null,
     "underWin": null,
     "underCollect": null};
  betTypes.forEach(betType => {
    const betAmount = randomBetAmount();
    const straightWinAmount = Math.floor(0.9 * betAmount);
    const straightCollectAmount = betAmount + straightWinAmount;
    const mlBetAmount = betAmount;
    let mlWinAmount = 1;
    switch (betType) {
    case 'ASP':
      panel.aspNum = line.awayPts;
      panel.aspBet = betAmount;
      panel.aspWin = straightWinAmount; 
      panel.aspCollect = straightCollectAmount;
      break;
    case 'AML':
      if (line.awayML > 0)
        mlWinAmount = Math.floor(line.awayML * mlBetAmount / 100.0);
      else
        mlWinAmount = Math.floor(-betAmount * 100.0 / line.awayML);
      panel.amlNum = line.awayML;
      panel.amlBet = betAmount;
      panel.amlWin = mlWinAmount; 
      panel.amlCollect = betAmount + mlWinAmount;
      break;
    case 'HSP':
      panel.hspNum = line.homePts;
      panel.hspBet = betAmount;
      panel.hspWin = straightWinAmount; 
      panel.hspCollect = straightCollectAmount;
      break;
    case 'HML':
      if (line.homeML > 0)
        mlWinAmount = Math.floor(line.homeML * betAmount / 100.0);
      else
        mlWinAmount = Math.floor(-betAmount * 100.0 / line.homeML);
      panel.hmlNum = line.homeML;
      panel.hmlBet = betAmount;
      panel.hmlWin = mlWinAmount; 
      panel.hmlCollect = betAmount + mlWinAmount;
      break;
    case 'OV':
      panel.overNum = line.over;
      panel.overBet = betAmount;
      panel.overWin = straightWinAmount; 
      panel.overCollect = straightCollectAmount;
      break;
    case 'UN':
      panel.underNum = line.under;
      panel.underBet = betAmount;
      panel.underWin = straightWinAmount; 
      panel.underCollect = straightCollectAmount;
      break;
    };
  });
  return await bets.submitPanel(userid, panel);
}

// ----------------------------------------------------------------------------
// First queries lines API for the list of current lines. Randomly chooses
// one or more lines to bet on from this list of current lines.
// For each chosen line, a betting panel is made and submitted to the
// bets module, who in turn will break apart the panel into individual bets
// and insert each in the mongo bets collection.
// ----------------------------------------------------------------------------

async function generateBets(userid) {
  const currentLines = await lines.get();
  const chosenLines = new Set();
  let nGames = randomInt(1, currentLines.length + 1);
  for (let i = 0; i < nGames; ++i)
    chosenLines.add(randomInt(0, currentLines.length));
  for (i of chosenLines.keys()) {
    let r = await makeAndSubmitPanel(userid, currentLines[i]);
    if (r.status == 402) {
      console.log("generation of bets cannot finish due to insufficient funds");
      return r;
    }
  }
  return {status: 200};
}

function randomBetType() {
  const bettypes = ['AML', 'ASP', 'HML', 'HSP', 'OV', 'UN'];
  const i = randomInt(0, bettypes.length);
  return bettypes[i];
}

function randomLine(linesArray) {
  if (!Array.isArray(linesArray))
    throw `randomLine arg must be an array`;
  return linesArray[randomInt(0, linesArray.length)];
}

function randomBetAmount() {
  return randomInt(10, 101);
}

// ----------------------------------------------------------------------------
// floor is inclusive; ceiling is exclusive
// range (ceiling - floor) is limited to 10000 currently.
// Example: randomInt(0, 6) --> 0, 1, 2, 3, 4, or 5 (never 6 or greater) 
// ----------------------------------------------------------------------------

function randomInt(floor, ceiling) {
  const range = ceiling - floor;
  return ((Math.random() * 10000).toFixed(0) % range) + floor;
}

module.exports = {
  generateBets
}

