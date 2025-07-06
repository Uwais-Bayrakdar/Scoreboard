const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

let db;

async function connectDB() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db('scoreboard'); // change if needed
  console.log("✅ Connected to MongoDB");
}

function getCollection() {
  return db.collection('users');
}

async function addUser(name, score) {
  const collection = getCollection();
  const result = await collection.insertOne({ name, score });
  return result;
}

async function getAllUsers() {
  return await getCollection().find({}).toArray();
}

async function updateUser(id, name, score) {
  return await getCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: { name, score } }
  );
}

async function deleteUser(username) {
  return await getCollection().deleteOne({ name: username });
}

async function deleteAllUsers() {
  return await getCollection().deleteMany({});
}

module.exports = {
  connectDB,
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
  deleteAllUsers
};
