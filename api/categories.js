const express = require("express");
const category_router = express.Router();

const { getCategories } = require("../db/categories");

// GET api/categories/ - returns all distinct categories of current businesses
category_router.get("/", async (req, res, next) => {
  try {
    let categories = await getCategories();
    // map remove count key from categories objects
    categories = categories.map(({ id, name }) => ({
      id,
      name,
    }));
    res.send({ categories });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = category_router;
