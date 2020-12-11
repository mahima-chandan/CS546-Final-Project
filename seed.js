const data = require('./data');
const {db} = require('./config');

async function main() {
  await data.bets.seed();
  await data.scores.seed();
  await data.settings.seed();
  await data.lines.seed();
  await data.users.seed();
}

main().then(() => {
  return db.dbConnection().then((db) => {
    return db.serverConfig.close();
    console.log(1);
  });
}).catch((e) => {
  console.log(e);
  return db.dbConnection().then((db) => {
    return db.serverConfig.close();
  });
});
