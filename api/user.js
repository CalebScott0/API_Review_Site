const express = require("express");
const user_router = express.Router();

const { getUserById } = require("../db/user");
const { getReviewsForUser } = require("../db/review");

// GET /api/user/
user_router.get("/", async (req, res, next) => {
  try {
    delete req.user.password;

    res.send({ user: req.user });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/user/:id
user_router.get("/:id", async (req, res, next) => {
  try {
    const user = (await getUserById(req.params.id))[0];
    // remove password before sending response
    delete user.password;

    res.send({ user });
  } catch (error) {
    next({
      name: "UserNotFound",
      message: "Unable to find User, check id is valid",
    });
  }
});

// GET /api/user/reviews/:id
user_router.get("/reviews/:author_id", async (req, res, next) => {
  try {
    const { author_id } = req.params;
    const { limit, offset } = req.query;
    const user_reviews = await getReviewsForUser({
      author_id,
      limit: +limit,
      offset: +offset,
    });

    res.send({ user_reviews });
  } catch (error) {
    next({
      name: "ReviewFetchError",
      message: "Unable to fetch user reviews",
    });
  }
});

module.exports = user_router;
