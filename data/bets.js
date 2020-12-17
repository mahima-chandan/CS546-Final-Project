const c = require('../config');
const {db} = require('../config');
const {ObjectID} = require('mongodb');
const timer = require('timers');
const scores = require('./scores.js');
const users = require('./users.js');

async function seed() {
  await deleteAll();
}

function merge(obj1, obj2) {
  var merged = {};
  for (var p in obj1)
    merged[p] = obj1[p];
  for (var p in obj2)
    merged[p] = obj2[p];
  return merged;
} 

// ----------------------------------------------------------------------------
// panel arg represents all the bets being made for a particular gameid,
// for the authenticated user (hard-coded below for now). It is NOT an array,
// but an object map that embodies all fields that typically emanate from a UI
// betting panel. Example panel incoming:
//
//  {"gameid": "ari-sea-2020-11-19",
//   "gameTime": "8:20 PM",
//   "gameDate": "Thursday, November 19",
//   "gameDateJulian": 1605835200000,
//   "lineDate": "20201117221505",
//   "aspNum": 7.5,
//   "aspBet": 55,
//   "aspWin": 50,
//   "aspCollect": 105,
//   "amlNum": 150,
//   "amlBet": null,
//   "amlWin": null,
//   "amlCollect": null,
//   "hspNum": -7,
//   "hspBet": 55,
//   "hspWin": 50,
//   "hspCollect": 105,
//   "hmlNum": -160,
//   "hmlBet": 80,
//   "hmlWin": 50,
//   "hmlCollect": 130,
//   "overNum": 48,
//   "overBet": 77,
//   "overWin": 70,
//   "overCollect": 147,
//   "underNum": 48,
//   "underBet": null,
//   "underWin": null,
//   "underCollect": null}
// ----------------------------------------------------------------------------

async function submitPanel(bettorid, panel) {
  const dbBets = await db.bets();
  const base =
    {bettorid,
     gameid: panel.gameid,
     paid: null,
     resolved: null,
     entered: new Date()};
  async function submitBet(bet) {
    const theBet = merge(base, bet);
    await dbBets.insertOne(theBet);
  }
  const panelBets = new Array();
  if (panel.aspBet) {
    const bet = {bettype: 'ASP',
                 num: Number(panel.awayPts),
                 amount: Number(panel.aspBet),
                 pays: Number(panel.aspWin),
                 collects: Number(panel.aspCollect)};
    panelBets.push(bet);
  }
  if (panel.amlBet) {
    const bet = {bettype: 'AML',
                 num: panel.amlNum,
                 amount: panel.amlBet,
                 pays: panel.amlWin,
                 collects: panel.amlCollect};
    panelBets.push(bet);
  }
  if (panel.hspBet) {
    const bet = {bettype: 'HSP',
                 num: panel.hspNum,
                 amount: panel.hspBet,
                 pays: panel.hspWin,
                 collects: panel.hspCollect};
    panelBets.push(bet);
  }
  if (panel.hmlBet) {
    const bet = {bettype: 'HML',
                 num: panel.hmlNum,
                 amount: panel.hmlBet,
                 pays: panel.hmlWin,
                 collects: panel.hmlCollect};
    panelBets.push(bet);
  }
  if (panel.overBet) {
    const bet = {bettype: 'OV',
                 num: panel.overNum,
                 amount: panel.overBet,
                 pays: panel.overWin,
                 collects: panel.overCollect};
    panelBets.push(bet);
  }
  if (panel.underBet) {
    const bet = {bettype: 'UN',
                 num: panel.underNum,
                 amount: panel.underBet,
                 pays: panel.underWin,
                 collects: panel.underCollect};
    panelBets.push(bet);
  }
  let betAmount = 0;
  panelBets.forEach(bet => { betAmount += bet.amount });
  console.log("before users.debitBalanceById for user id " + base.bettorid);
  let r = await users.debitBalanceById(base.bettorid, betAmount);
  console.log("back from users.debitBalanceById for user id " + base.bettorid);
  if (r.modifiedCount) {
    panelBets.forEach(async (bet) => { await submitBet(bet) });
    return {status: 200}
  }
  else {
    console.log("FAIL: users.debitBalanceById " + r);
    return {status: 402, msg: "possible insufficient funds"};
  }
}

async function deleteAll() {
  const dbBets = await db.bets();
  await dbBets.deleteMany({});
}

// ----------------------------------------------------------------------------
// Resolves unpaid bets by first interrogating scores API, and writing
// scores returned to the scores collection. Take note that scores API is
// not quick about posting new scores; can sometimes take many hours or
// even overnite for the source data to update. Debugging and testing should
// be done by betting on games that have already occurred as a back door
// into the system. (You are not going to want to wait for hours to get
// a score.)
//
// Once scores collection is updated, resolve() looks through all live bets in
// the database and resolves whatever it can find to resolve. This amounts to
// paying the winners and pushes and updating their balance in the users 
// collection.
//
// Only live bets are resolved. A live bet has paid = null, so this is the
// first query condition in the pipeline.
//
// A timer at bottom of this file is set up to periodically call resolve()
// in the background. Set to 1 hour for now.
//
// To run standalone for resolve, navigate to the ./data directory of the
// project, then bring up a node console shell, and type:
//
//   > let x = require('./bets')
//   > x.resolve()
// ----------------------------------------------------------------------------

async function resolve() {
  const bets = await db.bets();
  const users = await db.users();
  console.log("seeding scores to make sure they are up-to-date")
  await scores.seed();
  console.log("resolving live bets for completed games")
  let cur = bets.aggregate([
    { $match: { paid: null } },
    { $lookup: {
         from: "scores",
         localField: "gameid",
         foreignField: "_id",
         as: "score"
      }
    },
    { $match: { $expr: { $ne: [ { $size: "$score" }, 0 ] } } },
    { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$score", 0 ] }, "$$ROOT" ] } }
    },
    { $lookup: {
         from: "users",
         localField: "bettorid",
         foreignField: "_id",
         as: "bettor"
      }
    },
    { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$bettor", 0 ] }, "$$ROOT" ] } }
    },
    { $unset: ["bettor"] },
    { $addFields: {
       "outcome": {
          $switch: {
            branches: [
              { case: { $eq: [ "$bettype", "ASP" ] },
                then: { $subtract: [ { $sum: [ "$awayScore", "$num" ] }, "$homeScore" ] } },
              { case: { $eq: [ "$bettype", "HSP" ] },
                then: { $subtract: [ { $sum: [ "$homeScore", "$num" ] }, "$awayScore" ] } },
              { case: { $eq: [ "$bettype", "AML" ] },
                then: { $subtract: [ "$awayScore", "$homeScore" ] } },
              { case: { $eq: [ "$bettype", "HML" ] },
                then: { $subtract: [ "$homeScore", "$awayScore" ] } },
              { case: { $eq: [ "$bettype", "OV" ] },
                then: { $subtract: [ { $sum: [ "$homeScore", "$awayScore" ] }, "$num" ] } },
              { case: { $eq: [ "$bettype", "UN" ] },
                then: { $subtract: [ "$num", { $sum: [ "$homeScore", "$awayScore" ] } ] } } ],
            default: 0}}}},
    { $addFields: {
       "paid" : {
         $switch: {
           branches: [
             { case: { $gt: [ "$outcome", 0 ] },
               then: { $sum: [ "$amount", "$pays" ] } },
             { case: { $lt: [ "$outcome", 0 ] },
               then: 0 } ],
           default: "$amount"}}}}])

  let f = async (x) => {
    const resolvedDate = new Date().toISOString().substring(0, 10);
    await bets.updateOne({_id: x._id}, { $set: { "paid": x.paid,
                                                 "resolved" : resolvedDate } });
    await users.updateOne({_id: x.bettorid}, { $inc: { balance: x.paid }});
  };
  cur.forEach(f);
  console.log("resolve has finished")
}

let _resolveTimer = null;

function startResolveProcessor() {
  if (!_resolveTimer)
    _resolveTimer = timer.setInterval(resolve, 3600 * 1000);
}

function stopResolveProcessor() {
  if (_resolveTimer) {
    clearInterval(_resolveTimer);
    _resolveTimer = null;
  }
}

async function getByUserId(bettorid) {
  const dbBets = await db.bets();
  return await dbBets.find({bettorid});
}

async function getTotalsByUserID(bettorid) {
  const bets = await getByUserId(bettorid);
  const betArr = await bets.toArray();
  let totals = {
    amount: 0,
    pays: 0,
    collects: 0,
    paid: 0,
    standing: 0,
    pending: 0
  };

  // aggregates totals of amount, pays, collects and paid for each bet
  for(bet of betArr){
    totals.amount += bet.amount;
    totals.pays += bet.pays;
    totals.collects += bet.collects;
    totals.paid += bet.paid;
  }

  // calculates standing total (how much you have won or lost based on resolved bets)
  // calculates pending, an amount which you could possibly win based on unreolved bets
  for(bet of betArr){
    if(bet.resolved !== null){
      totals.standing += (bet.paid - bet.amount)
    }
    else if(bet.resolved == null){
      totals.pending += bet.pays
    }
  }
  return totals;
}

async function getBets() {
  const dbBets = await db.bets();
  return await dbBets.find();
}

async function houseTotals(){
  const bets = await getBets();
  const betArr = await bets.toArray();
  let totals = {
    amount: 0,
    pays: 0,
    collects: 0,
    paid: 0,
    curPayout: 0,
    curProfit: 0,
    futPayout:0,
    futProfit:0
  };

  // aggregates totals of amount, pays, collects and paid for each bet
  for(bet of betArr){
    totals.amount += bet.amount;
    totals.pays += bet.pays;
    totals.collects += bet.collects;
    totals.paid += bet.paid;
  }

  // calculates standing total (how much you have won or lost based on resolved bets)
  // calculates pending, an amount which you could possibly win based on unreolved bets
  for(bet of betArr){
    if(bet.resolved !== null){
      totals.curPayout += (bet.paid);
      totals.curProfit += (bet.amount - bet.paid)
    }
    else if(bet.resolved == null){
      totals.futPayout += bet.pays;
      totals.futProfit += bet.amount;
    }
  }
  return totals;

}

module.exports = {
  deleteAll,
  getByUserId,
  resolve,
  seed,
  startResolveProcessor,
  stopResolveProcessor,
  submitPanel,
  getTotalsByUserID,
  getBets,
  houseTotals
};

