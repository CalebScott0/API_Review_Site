const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

// const redis = require("redis");

// const redisClient = redis.createClient(6379);

// redisClient.on("error", (err) => console.error("Redis Error:", err));

// redisClient.on("connect", () => console.log("Redis Client Connected"));

const server = express();

// http logging middlewawre
server.use(morgan("dev"));
// json body parser
server.use(express.json());
// CORS
server.use(cors());

server.get("/", (req, res) => {
  res.send({ message: "Working" });
});

server.use("/api", require("./api/index"));

server.use((error, req, res, next) => {
  res.status(500).send({ error });
});

module.exports = server;
