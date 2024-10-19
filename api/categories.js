const express = require("express");
const category_router = express.Router();

const { getCategories } = require("../db/categories");

// GET api/categories/ - returns all distinct categories of current businesses
category_router.get("/", async (req, res, next) => {
  try {
    const categories = await getCategories();
    res.send({ categories });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = category_router;
