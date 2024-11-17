const express = require("express");
const users_router = express.Router();

const { getUserById } = require("../db/users");
const { getReviewsForUser, getUserReviewByBusiness } = require("../db/reviews");

// GET /api/users/me - get authenticated user
users_router.get("/me", async (req, res, next) => {
  try {
    delete req.user.password;

    res.send({ user: req.user });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/users/:user_id
users_router.get("/:user_id", async (req, res, next) => {
  try {
    const id = req.params.user_id;

    const user = (await getUserById(id))[0];
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

// GET /api/users/:user_id/reviews
users_router.get("/:user_id/reviews", async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { limit, offset } = req.query;
    const user_reviews = await getReviewsForUser({
      user_id,
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

// GET /api/users/:user_id/review/business/:business_id
users_router.get(
  "/:user_id/review/business/:business_id",
  async (req, res, next) => {
    try {
      const { user_id, business_id } = req.params;

      const user_review_for_business = await getUserReviewByBusiness(
        user_id,
        business_id
      );

      res.send({ user_review_for_business });
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

module.exports = users_router;
