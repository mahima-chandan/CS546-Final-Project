const c = require('../config');
const {db} = require('../config');
const {ObjectID} = require('mongodb');

const simdate = "2020-11-23";

async function seed() {
  const settings = await db.settings();
  await settings.deleteOne({});
  await settings.insertOne({simdate});
}

module.exports = {
  seed
};

