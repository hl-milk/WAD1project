const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");

const server = express();

// Load environment variables
dotenv.config({ path: "./config.env" });

// Middleware
server.use(express.urlencoded({ extended: true }));
server.set("view engine", "ejs");

server.use(session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: false
}));

// Routes
const movieRoutes = require("./routes/movie-routes");
server.use("/", movieRoutes);

// Connect to DB
async function connectDB() {
    try {
        await mongoose.connect(process.env.DB);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

// Start server
function startServer() {
    const hostname = "localhost";
    const port = 8000;

    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}

// Connect DB first, then start server
connectDB().then(startServer);