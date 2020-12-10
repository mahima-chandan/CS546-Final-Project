const c = require('../config');
const {db} = require('../config');
const {ObjectID} = require('mongodb');
const timer = require('timers');
const scores = require('./scores.js');

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
    await users.updateOne({_id: x.bettorid}, { $set: { "balance": x.balance + x.paid }});
  };
  cur.forEach(f);
  console.log("resolve has finished")
}

timer.setInterval(resolve, 3600 * 1000);

module.exports = {
  deleteAll,
  resolve
};

