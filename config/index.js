const MongoClient = require('mongodb').MongoClient;

// ----------------------------------------------------------------------------
// Configuration used by the system.
//
// Only one year is supported at a time, currently set to 2020.
// ----------------------------------------------------------------------------

const appConfig = {
  database: 'jerry',
  minBet: 10,
  dbUrl: 'mongodb://localhost:27017/',
  year: "2020"
};

let _connection = undefined;
let _db = undefined;

async function dbConnection() {
  if (!_connection) {
    _connection = await MongoClient.connect(appConfig.dbUrl,
                                             {useNewUrlParser: true,
                                              useUnifiedTopology: true});
    _db = await _connection.db(appConfig.database);
  }
  return _db;
};

// ----------------------------------------------------------------------------
// Modified from what was provided in lecture, as that lecture function has
// a problem if the exiting collection is dropped and then recreated, which
// can happen during things like seeding.
// ----------------------------------------------------------------------------

const getCollectionFn = (collection) => {
  return async () => {
    const db = await dbConnection();
    return await db.collection(collection);
  }
};

module.exports = {
  appConfig,
  db: {
    dbConnection,
    bets: getCollectionFn('bets'),
    lines: getCollectionFn('lines'),
    scores: getCollectionFn('scores'),
    settings: getCollectionFn('settings'),
    signup: getCollectionFn('signup'),
    users: getCollectionFn('users'),
  }
};
