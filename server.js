const express = require("express");
const server = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require("path");
const session = require('express-session');

server.use(express.urlencoded({ extended: true }));
server.set("view engine", "ejs");
server.use("/", express.static(path.join(__dirname, "public")));
server.use(express.json());

dotenv.config({ path: './config.env' });

server.use(session({
    secret: process.env.SECRET, 
    resave: false,
    saveUninitialized: false
}));

const userRoutes = require("./routes/user-routes");
server.use("/", userRoutes);

const movieRoutes= require("./routes/movie-routes")

const watchlistRoutes = require("./routes/watchlist-routes");
server.use("/", watchlistRoutes);

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

function startServer() {
  const hostname = "localhost";
  const port = 8000;

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

connectDB().then(startServer);
