// CHANGE THIS TO BE A COMBINED SEARCH ENDPOINT WITH BUSINESSES?

const { getCategoriesByName } = require("../db/category");

const { getBusinessesByName } = require("../db/business");
const express = require("express");
const search_router = express.Router();

// slice out 3-4~ from businesses and categories in search combined endpoint

// const express = require("express");
// const category_router = express.Router();

// const { getCategories } = require("../db/category");

// // GET api/category/list/all_categories - returns all distinct categories of current businesses
// category_router.get("/list/all_categories", async (req, res, next) => {
//   try {
//     const categories = await getCategories();
//     res.send({ categories });
//   } catch ({ name, message }) {
//     next({ name, message });
//   }
// });

// module.exports = category_router;

async function test() {
  const { query } = { query: "Ac" };
  const [categories, businesses] = await Promise.all([
    getCategoriesByName({ query }),
    getBusinessesByName({ query }),
  ]);
  console.log([...categories, ...businesses]);
}
test();
