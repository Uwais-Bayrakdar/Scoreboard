const express = require('express');
const {addUser,getAllUsers ,updateUser, deleteUser ,deleteAllUsers } = require('../db/userDB');
const path = require('path');
const Router = express.Router();
require('dotenv').config();

const admin_username = process.env.ADMIN_USERNAME;
const admin_password = process.env.ADMIN_PASSWORD;


const port = process.env.PORT || 4000 

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

Router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === admin_username && password === admin_password) {
        req.session.user = { name: username };
        return res.json({ success: true });
    }

    res.status(401).json({ success: false, message: "Unauthorized" });
});

Router.post('/userlist', async (req, res) => {
    const {username, userScore} = req.body;

    if (!username || !userScore) {
        return res.status(400).json({success: false, error: "Please provide both user name score"});
    }

    try {
        await addUser(username, Number(userScore));
        res.status(201).json({
            success: true,
            user: {
                _id: result.insertedId,
                name: username,
                score: userScore
            }    
        });
    } catch (e) {
        res.status(500).json({success: false, error: "Failed to add user"});
    }
})

Router.get('/userlist', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(201).json({success: true, users}); 
    } catch (e) {
        console.log("Failed to fetch users: ", e);
        res.status(500).json({success: false, error: "Failed to fetch users"});
    }
})

Router.put('/userlist/:id', async (req, res) => {
    try {
        const {newUsername, newUserScore} = req.body;
        const id = req.params.id;
        const result = await updateUser(id, newUsername, newUserScore);
        res.status(200).json({success: true, result});
    } catch (e) {
        res.status(500).json({success: false, error: "failed to update user"});
    }
})

Router.delete('/userlist', async (req, res) => {
    try {
        await deleteAllUsers();
        res.status(201).json({success: true, message: "All users deleted"});
        console.log("successfully removed all users");
    } catch (e) {
        res.status(500).json({success: false, error: "Failed to delete users"});
    }
})

Router.delete('/userlist/:username', async (req, res) => {
    const {username} = req.params;

    if (!username) {
        return res.status(400).json({success:false, error: "username required"});
    }

    try {
        await deleteUser(username);
        res.status(200).json({success:true, message: `user ${username} deleted`});
        console.log(`user ${username} deleted`);
    } catch (e) {
        res.status(500).json({success:false, error: "failed to delete user"});
    }
})

Router.get('/board.html',(req, res) => {
    res.sendFile(path.join(__dirname, "public", "board.html"));
})

module.exports = Router;