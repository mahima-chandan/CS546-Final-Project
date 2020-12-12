const axios = require('axios');
const c = require('../config');
const {db} = require('../config');
const {ObjectID} = require('mongodb');
const fs = require('fs-extra');

async function seed() {
  const lines = await db.lines();
  await lines.deleteMany({});
  await importFiles();
}

// ----------------------------------------------------------------------------
// Files in line_files directory are imported into the Lines collection.
// This is done only as part of seeding the system.
// ----------------------------------------------------------------------------

async function importFiles() {
  const basedir = "data/line_files";
  const dir = await fs.promises.opendir(basedir);
  const dbLines = await db.lines();

  for await (d of dir) {
    const lineDateObj = parseLineDate(d.name);
    if (!lineDateObj)
      continue;
    function spliceInLineDates(lineObj) {
      lineObj.lineDate = lineDateObj.lineDate;
      lineObj.lineDateJulian = lineDateObj.lineDateJulian;
      lineObj.lineDateStr = lineDateObj.lineDateStr;
      return lineObj;
    }
    const fileContents = await fs.readFile(basedir + '/' + d.name, 'ascii');
    const currentLines = new Array();
    const ctx = { currentLines };
    await parse(ctx, fileContents);
    ctx.currentLines = ctx.currentLines.map(spliceInLineDates);
    if (ctx.currentLines.length) {
      dbLines.insertMany(ctx.currentLines);
      console.log("imported line file " + d.name);
    }
    else
      console.error("Warning: " + d.name + " has no lines and will be ignored");
  }
}

async function parse(ctx, s) {
  i = s.indexOf("HeaderScoreboardWrapper")
  s = s.substring(i, i + 90000);

  let batches = s.split('margin-subtitle"');
  for (let i = 1; i < batches.length; ++i)
    await doMSBatch(ctx, batches[i]);
}

async function doMSBatch(ctx, batch) {
  let x = batch.substring(0, 32);3
  ctx.gameDate = x.replace(/<\/div.*$/, '');
  ctx.gameDate = ctx.gameDate.substring(1);
  let batches = batch.split('Table__TH"');
  for (let i = 0; i < batches.length; ++i)
    await doTHBatch(ctx, batches[i]);
}

async function doTHBatch(ctx, batch) {
  if (batch.search(/^>.*:.* PM/) == 0) {
    batch = batch.replace(/PM<\/.*$/, "PM");
    ctx.gameTime = batch.substring(1);
    return;
  }
  if (batch.search(/^>FPI/) == 0)
    ctx.currentLines.push(await doGameBatch(ctx, batch));
}

// first item of the batch is where I extract the date from, to use on all
// the other items in the batch. Skip further processing on this first item after
// the split on team/_/name since first items only role is to provide
// the game date.

async function doGameBatch(ctx, batch) {
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
    let friendlyGameDate = new Date(ctx.gameDate + `, ${c.year}`).toISOString();
    let jsGameDate = friendlyGameDate.substring(0, 10);
    let gameDateJulian = new Date(ctx.gameDate + `, ${c.year} ` + ctx.gameTime).valueOf();
    return ({gameid: awayShort + "-" + homeShort + "-" + jsGameDate,
        gameTime: ctx.gameTime,
        gameDate: ctx.gameDate,
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
        homeLong});
  }
  catch (e) {
    console.log(e);
    console.log('gameBatch: ' + batch);
    return null;
  }
}

// ----------------------------------------------------------------------------
// Takes 'date' file name such as 11282020.html in the format "MMddyyyy.html",
// and returns an object holding this date in 3 different formats:
//
//   lineDate        e.g. "2020-11-27T05:00:00.000Z"
//   lineDateStr     e.g. "2020-11-27"
//   lineDateJulian  e.g. 1606453200000
//
// This function does not look inside the file or parse file contents, it
// only parses the file name. 
// ----------------------------------------------------------------------------

function parseLineDate(s) {
  const pieces = s.match("[0-9]{8}");
  if (!pieces)
    return;
  let datestr = pieces[0]; 
  const month = datestr.substring(0, 2);
  const day = datestr.substring(2, 4);
  const year = datestr.substring(4, 8);
  const lineDate = new Date(month + "/" + day + "/" + year);
  const lineDateStr = year + "-" + month + "-" + day;
  const lineDateJulian = lineDate.valueOf();
  return {lineDate, lineDateJulian, lineDateStr};
}

async function readDatabaseLines(simdate) {
  let currentLines = new Array(); 
  const dbLines = await db.lines();
  let lines = dbLines.find({lineDateStr: simdate});
  return lines.count() ? lines.toArray() : [];
}

async function readOnlineLines() {
  let currentLines = new Array(); 
  const obj = await axios.get('https://www.espn.com/nfl/lines');
  let ctx = { currentLines };
  await parse(ctx, obj.data);
  return ctx.currentLines;
}

async function get() {
  const settings = await db.settings();
  let {simdate} = await settings.find().next();
  console.log(simdate);
  if (simdate)
    return await readDatabaseLines(simdate);
  else
    return await readOnlineLines();
}

module.exports = {
  get,
  parse,
  seed
}

