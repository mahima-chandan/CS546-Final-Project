const c = require('../config');
const {db} = require('../config');
const {ObjectID} = require('mongodb');
const fs = require('fs-extra');

async function seed() {
  const lines = await db.lines();
  await lines.deleteMany({});
  await importFiles();
}

// Needed for simulation/demo only. Will code soon.

async function importFiles() {
  const dir = await fs.promises.opendir("data/line_files");
/*
  for await (d of dir)
    console.log(d.name);
*/
}

module.exports = {
  importFiles,
  seed
}

//seed().catch(console.log);
