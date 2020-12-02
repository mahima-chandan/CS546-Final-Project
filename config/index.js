const MongoClient = require('mongodb').MongoClient;

// ----------------------------------------------------------------------------
// Configuration used by the system.
//
// Only one year is supported at a time, currently set to 2020.
// ----------------------------------------------------------------------------

const mongoConfig = {
  serverUrl: 'mongodb://localhost:27017/',
  database: 'jerry'
};

let _connection = undefined;
let _db = undefined;

let dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl,
                                             {useNewUrlParser: true,
                                              useUnifiedTopology: true});
    _db = await _connection.db(mongoConfig.database);
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
  year: "2020",
  db: {
    dbConnection,
    bets: getCollectionFn('bets'),
    lines: getCollectionFn('lines'),
    scores: getCollectionFn('scores'),
    settings: getCollectionFn('settings'),
    users: getCollectionFn('users'),
  }
};
