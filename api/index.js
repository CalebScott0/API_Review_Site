const express = require("express");
const jwt = require("jsonwebtoken");

const { getUserById } = require("../db/user");

const api_router = express.Router();

api_router.use("/business", require("./business"));

api_router.use("/user", require("./user"));

module.exports = api_router;
