const {MongoClient} = require('mongodb');
const {ObjectId} = require('mongodb');
require('dotenv').config();

const mongo_uri = process.env.MONGO_URI;

const uri = mongo_uri;
const client = new MongoClient(uri);

let users;

async function connectDB() {
    try {
        await client.connect();
        const db = client.db("UserDB");
        users = db.collection("users");

    } catch (e) {
        console.log("error in run function in db:", e);
    }
}

async function addUser(userName, userScore) {
    return await users.insertOne({username: userName, score: userScore});
}

async function getAllUsers() {
    return await users.find({}).toArray();
}

async function updateUser(id, newName, newScore) {
    return await users.updateOne(
        {_id: ObjectId.createFromHexString(id)},
        {$set: {username: newName, score: newScore}}
    );
}

async function deleteUser(username) {
    return await users.deleteOne({username: username});
}

async function deleteAllUsers() {
    return await users.deleteMany({});
}

module.exports = {
    connectDB,
    addUser,
    getAllUsers,
    updateUser,
    deleteUser,
    deleteAllUsers
}