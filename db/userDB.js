const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

let db;


async function connectDB() {
    const client = new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        tls: true, // 🔑 Critical for Render's TLS handshake
        serverApi: '1' // Optional but can help with stable connection to Atlas
    });

    await client.connect();
    db = client.db('ScoreTrackerDB'); // replace with your DB name if different
    console.log("✅ Connected to MongoDB");
}


function getCollection() {
    if (!db)
        throw new Error("❌ Database not initialized");

    return db.collection('users');
}

async function addUser(name, score) {
    const collection = getCollection();
    const result = await collection.insertOne({ name, score });
    return result;
}

async function getAllUsers() {
  const collection = getCollection();
  return await collection.find({}).toArray(); // ✅ Now this will work
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
    getCollection,
    addUser,
    getAllUsers,
    updateUser,
    deleteUser,
    deleteAllUsers
};
