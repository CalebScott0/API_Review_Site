const express = require("express");
const jwt = require("jsonwebtoken");
const { requireUser } = require("./__utils__/utils");
const { getUserById } = require("../db/users");

const api_router = express.Router();

// set req.user if available from log in for future authenticated requests
api_router.use(async (req, res, next) => {
  const PREFIX = "Bearer ";

  const AUTH = req.header("Authorization");

  //   if request does not need auth header move on
  if (!AUTH) {
    next();
  } else if (AUTH.startsWith(PREFIX)) {
    const TOKEN = AUTH.slice(PREFIX.length);
    try {
      const { id } = jwt.verify(
        TOKEN,
        process.env.JWT || "Super secret super safe"
      );

      //   if id is created from jwt verify, set req.user
      if (id) {
        req.user = (await getUserById(id))[0];
        next();
      }
    } catch (error) {
      res.status(400).send({
        name: "AuthorizationHeaderError",
        message: "Authorization Token Malformed",
      });
    }
  } else {
    res.status(400).send({
      name: "AuthorizationHeaderError",
      message: `Authorization Token must start with ${PREFIX}`,
    });
  }
});

// /api/businesses
api_router.use("/businesses", require("./businesses"));

// /api/users
api_router.use("/users", requireUser, require("./users"));

// /api/auth
api_router.use("/auth", require("./auth/auth"));

// /api/reviews
api_router.use("/reviews", requireUser, require("./reviews"));

// /api/search
api_router.use("/search", require("./search"));

// /api/categories
api_router.use("/categories", require("./categories"));

module.exports = api_router;
