const c = require('../config');
const {db} = require('../config');
const {ObjectID} = require('mongodb');

const simdate = "2020-11-27";

async function seed() {
  const settings = await db.settings();
  await settings.deleteOne({});
  await settings.insertOne({simdate});
}

async function saveSimDate(simdate) {
  const settings = await db.settings();
  await settings.updateOne({}, {$set: {simdate}});
}

module.exports = {
  seed,
  saveSimDate
};

