const c = require("../config");
const { db } = require("../config");
const { ObjectID } = require("mongodb");

const group = [
  { _id: "6ee7718c75ee6029745ca8ac", username: "madelaine", pwd: null, role: 1, balance: 1000 },
  { _id: "7ee8728c75ee6029745ca8ad", username: "mahima",    pwd: null, role: 1, balance: 1000 },
  { _id: "8ee9738c75ee6029745ca8ae", username: "amrutha",   pwd: null, role: 1, balance: 1000 },
  { _id: "9eea748c75ee6029745ca8af", username: "christian", pwd: null, role: 1, balance: 1000 },
  { _id: "aeeb758c75ee6029745ca8a0", username: "dale",      pwd: null, role: 1, balance: 1000 },
];

const others = [{ username: "guest", pwd: null, role: 1, balance: 1000 }];

async function seed() {
  const users = await db.users();
  await users.deleteMany({});
  await users.insertMany(group);
  await users.insertMany(others);
}

async function getUserByName(name) {
  const userCollection = await db.users();
  const user = await userCollection.findOne({ username: name });
  return user;
}

async function updateBalance(name, newlyAddedBalance) {
  const user = await this.getUserByName(name);
  let value = Number(user.balance) + Number(newlyAddedBalance);
  let updation = {
    balance: value,
  };
  const userCollection = await db.users();
  let updatedBalance = await userCollection.updateOne(
    { username: name },
    { $set: updation }
  );
  return value;
}

module.exports = {
  seed,
  getUserByName,
  updateBalance,
};
