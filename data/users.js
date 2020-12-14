const c = require("../config");
const { db } = require("../config");
const { ObjectID } = require("mongodb");
const bcrypt = require('bcryptjs');

const group = [
  { _id: "6ee7718c75ee6029745ca8ac", username: "madeline", pwd: null, role: 1, balance: 1000 },
  { _id: "7ee8728c75ee6029745ca8ad", username: "mahima",    pwd: null, role: 1, balance: 1000 },
  { _id: "8ee9738c75ee6029745ca8ae", username: "amrutha",   pwd: null, role: 1, balance: 1000 },
  { _id: "9eea748c75ee6029745ca8af", username: "christian", pwd: null, role: 1, balance: 1000 },
  { _id: "aeeb758c75ee6029745ca8a0", username: "dale",      pwd: null, role: 1, balance: 1000 },
];

const others =[
  { _id: "beeb758c75ee6029745ca821", username: "guest", pwd: null, role: 1, balance: 1000 }
];

async function seed() {
  const users = await db.users();
  await users.deleteMany({});
  await users.insertMany(group);
  await users.insertMany(others);
  users.createIndex( { "username": 1 }, { unique: true } )
}

async function getUserById(id) {
  const dbUsers = await db.users();
  const user = dbUsers.findOne({_id: id});
  return user;
}

async function getUserByName(username) {
  const dbUsers = await db.users();
  return await dbUsers.findOne({username});
}

// ----------------------------------------------------------------------------
// Allows some privileged seeded group members to authenticate without a
// password.
// ----------------------------------------------------------------------------

async function verifyPassword(user, pwd) {
  return !user.pwd || bcrypt.compareSync(pwd, user.pwd);
}

// ----------------------------------------------------------------------------
// Pass in the amount you want to debit (reduce) the balance by.
// A positive amt will *reduce* the user's available balance and is the
// expected use for this function.
// ----------------------------------------------------------------------------

async function debitBalanceById(id, amt) {
  const dbUsers = await db.users();
  return await dbUsers.updateOne(
    {_id: id, balance: { $gte: amt } }, { $inc: { balance: -amt } });
}

async function updateBalance(name, newlyAddedBalance) {
  const user = await this.getUserByName(name);
  let value = Number(user.balance) + Number(newlyAddedBalance);
  let updation = {
    balance: value,
  };
  const dbUsers = await db.users();
  let updatedBalance = await dbUsers.updateOne(
    { username: name },
    { $set: updation }
  );
  return value;
}

module.exports = {
  seed,
  getUserById,
  getUserByName,
  updateBalance,
  debitBalanceById,
  verifyPassword
};
