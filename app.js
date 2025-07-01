const express = require('express');
const path = require('path');
const RouteApi = require("./routes/ROUTEApi");
const {connectDB} = require('./db/userDB');
const cors = require('cors');

// Allow requests from your GitHub Pages domain
app.use(cors({
  origin: ['https://uwais-bayrakdar.github.io', 'http://localhost:3000'], // Add localhost for development
  credentials: true
}));
connectDB();

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use('/api', RouteApi);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
})

app.get("/login", (req,res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
})

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
})

app.listen(3000, () => {
    console.log("http://localhost:3000");
})