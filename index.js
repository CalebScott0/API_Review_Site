const server = require("./server");
require("dotenv").config;
// const redis = require("redis");

const PORT = process.env.port || 8080;
// const REDIS_PORT = process.env.port || 6379;

// const redisClient = redis.createClient(REDIS_PORT);

// (async () => {
//   await redisClient.connect();
// })();

server.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));
// redisClient.on("connect", () => {
// console.log(`Redis connected, starting express server...`);
// });

// redisClient.on("error", (err) => console.error("Redis error:", err));
