const express = require("express");
const categories_router = express.Router();

const { getCategories } = require("../db/categories");

// GET api/categories/ - returns all distinct categories of current businesses
categories_router.get("/", async (req, res, next) => {
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

module.exports = categories_router;
