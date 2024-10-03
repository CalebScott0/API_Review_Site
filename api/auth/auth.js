const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createUser, getUserByUsername } = require("../../db/user");
const { checkUserData, checkUserExists } = require("./utils");

const auth_router = express.Router();

// POST /api/auth/register
auth_router.post(
  "/register",
  checkUserData,
  checkUserExists,
  async (req, res, next) => {
    try {
      const { password } = req.body;

      //   hash password
      const HASH_PASS = await bcrypt.hash(password, +process.env.SALT || 7);

      //   create user with hashed password
      const user = await createUser({ ...req.body, password: HASH_PASS });

      //   create JWT token with user id
      const TOKEN = jwt.sign(
        { id: user.id },
        process.env.JWT || "Super secret super safe",
        { expiresIn: "1d" }
      );

      res.status(201).send({ TOKEN });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/auth/login
auth_router.post("/login", checkUserData, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // find user by username
    const user = await getUserByUsername(username);
    // check if user exists
    if (!user) {
      return res.status(401).send({ message: "Account does not exist" });
    }
    // run bcrypt if login was NOT via OAuth
    const is_same_pass = await bcrypt.compare(password, user?.password);
    if (!is_same_pass) {
      return res.status(401).send({ message: "Invalid login credentials" });
    }
    // if user exists, and password match, create token with user id
    const TOKEN = jwt.sign(
      { id: user.id },
      process.env.JWT || "Super secret super safe",
      { expiresIn: "1d" }
    );

    res.send({ TOKEN });
  } catch (error) {
    next(error);
  }
});

module.exports = auth_router;
