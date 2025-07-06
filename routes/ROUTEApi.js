const express = require('express');
const path = require('path');
const {
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
  deleteAllUsers
} = require('../db/userDB');

require('dotenv').config();

const router = express.Router();

const admin_username = process.env.ADMIN_USERNAME;
const admin_password = process.env.ADMIN_PASSWORD;

// Routes
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === admin_username && password === admin_password) {
    return res.json({ success: true });
  }

  res.status(401).json({ success: false, message: "Unauthorized" });
});

router.post('/userlist', async (req, res) => {
  const { username, userScore } = req.body;

  if (!username || !userScore) {
    return res.status(400).json({ success: false, error: "Please provide both user name and score" });
  }

  try {
    const result = await addUser(username, Number(userScore));
    res.status(201).json({
      success: true,
      user: {
        _id: result.insertedId,
        name: username,
        score: userScore
      }
    });
  } catch (e) {
    console.error("Add user error:", e);
    res.status(500).json({ success: false, error: "Failed to add user" });
  }
});

router.get('/userlist', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ success: true, users });
  } catch (e) {
    console.error("Fetch users error:", e);
    res.status(500).json({ success: false, error: "Failed to fetch users" });
  }
});

router.put('/userlist/:id', async (req, res) => {
  try {
    const { newUsername, newUserScore } = req.body;
    const id = req.params.id;
    const result = await updateUser(id, newUsername, newUserScore);
    res.status(200).json({ success: true, result });
  } catch (e) {
    console.error("Update user error:", e);
    res.status(500).json({ success: false, error: "Failed to update user" });
  }
});

router.delete('/userlist', async (req, res) => {
  try {
    await deleteAllUsers();
    res.status(200).json({ success: true, message: "All users deleted" });
    console.log("Successfully removed all users");
  } catch (e) {
    console.error("Delete all users error:", e);
    res.status(500).json({ success: false, error: "Failed to delete users" });
  }
});

router.delete('/userlist/:username', async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ success: false, error: "Username required" });
  }

  try {
    await deleteUser(username);
    res.status(200).json({ success: true, message: `User ${username} deleted` });
    console.log(`User ${username} deleted`);
  } catch (e) {
    console.error("Delete user error:", e);
    res.status(500).json({ success: false, error: "Failed to delete user" });
  }
});

router.get('/board.html', (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "board.html"));
});

// ✅ Export only the router
module.exports = router;
