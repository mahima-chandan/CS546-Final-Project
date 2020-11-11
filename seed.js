const data = require('./data');
const {db} = require('./config');

async function main() {
  await data.scores.seed();
}

main().then(() => {
  return db.dbConnection().then((db) => {
    return db.serverConfig.close();
  });
}).catch((e) => {
  console.log(e);
  return db.dbConnection().then((db) => {
    return db.serverConfig.close();
  });
});
