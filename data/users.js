const c = require('../config');
const {db} = require('../config');
const {ObjectID} = require('mongodb');

const team =
  [{username: "madelaine", pwd: null, role: 1, balance: 1000},
   {username: "mahima",    pwd: null, role: 1, balance: 1000},
   {username: "amrutha",   pwd: null, role: 1, balance: 1000},
   {username: "christian", pwd: null, role: 1, balance: 1000},
   {username: "dale",      pwd: null, role: 1, balance: 1000}];

const others =
  [{username: "guest", pwd: null, role: 1, balance: 1000}];
  
async function seed() {
  const users = await db.users();
  await users.deleteMany({});
  await users.insertMany(team);
  await users.insertMany(others);
}

module.exports = {
  seed
};

