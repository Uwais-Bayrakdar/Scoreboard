const express = require('express');
const path = require('path');
const RouteApi = require("./routes/ROUTEApi");
const { connectDB } = require('./db/userDB');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Use dynamic port for Render, fallback to 3000 locally
const PORT = process.env.PORT || 3000;

// ✅ Allow CORS from GitHub Pages and localhost
app.use(cors({
  origin: ['https://uwais-bayrakdar.github.io', 'http://localhost:3000'],
  credentials: true
}));

// ✅ Connect to MongoDB
connectDB();

// ✅ Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use('/api', RouteApi);

// ✅ Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
