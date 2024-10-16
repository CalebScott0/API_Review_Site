// CHANGE THIS TO BE A COMBINED SEARCH ENDPOINT WITH BUSINESSES?

const { getCategoriesByName } = require("../db/category");

const { getBusinessesByName } = require("../db/business");
const express = require("express");
const search_router = express.Router();

const LATITUDE = 39.7683331;
const LONGITUDE = -86.1583502;
const RADIUS = 16093.4;
// defaults for indiananopilis, put these in env!!!! and change in business db to env variable

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
