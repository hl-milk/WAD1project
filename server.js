const express = require("express");
const server = express();

server.use(express.urlencoded({ extended: true }));
server.set("view engine", "ejs");

const homeRoutes = require("./routes/home-routes");
const movieDetailRoutes = require("./routes/movie-detail-routes")

server.use("/", homeRoutes);
server.use("/", movieDetailRoutes)

const hostname = "localhost";
const port = 8000;

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
