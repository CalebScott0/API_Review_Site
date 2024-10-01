const express = require("express");
const jwt = require("jsonwebtoken");

const { getUserById } = require("../db/users");

(async () => {
  console.log(await getUserById("---1lKK3aKOuomHnwAkAow"));
})();

const apiRouter = express.Router();

module.exports = apiRouter;
