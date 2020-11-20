const c = require('../config');
const {db} = require('../config');
const {ObjectID} = require('mongodb');
const timer = require('timers');
const scores = require('./scores.js');

// ----------------------------------------------------------------------------
// Resolves unpaid bets by first interrogating scores API, and writing
// scores returned to the scores collection. Take note that scores API is
// not quick // about posting new scores; can sometimes take many hours or
// even overnite for the source data to update. Debugging and testing should
// be done by betting on games that have already occurred as a back door
// into the system. (You are not going to want to wait for hours to get
// a score.)
//
// Once scores collection is updated, resolve() looks through all live bets in
// the database and resolves whatever it can find to resolve. This amounts to
// paying the winners and pushes and updating their balance in the bettors
// collection.
//
// A timer at bottom of this file is set up to periodically call resolve()
// in the background. Set to 1 hour for now.
// ----------------------------------------------------------------------------

async function resolve() {
  console.log("inside resolve at " + Date());
  const bets = await db.bets();
  const bettors = await db.bettors();
  await scores.seed();
  let cur = bets.aggregate([
    { $match: { paid: null } },
    { $lookup: {
         from: "scores",
         localField: "gameid",
         foreignField: "_id",
         as: "score"
      }
    },
    { $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$score", 0 ] }, "$$ROOT" ] } }
    },
    { $lookup: {
         from: "bettors",
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
    console.log(x);
    await bets.updateOne({_id: x._id}, { $set: { "paid": x.paid } });
    await bettors.updateOne({_id: x.bettorid}, { $set: { "balance": x.balance + x.paid }});
  };
  return await cur.forEach(f);
}

timer.setInterval(resolve, 3600 * 1000);

module.exports = {
  resolve
};

