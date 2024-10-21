const { getCategoriesByName } = require("../db/categories");

const {
  getBusinessesByName,
  getBusinessesCityState,
} = require("../db/businesses");
const express = require("express");
const search_router = express.Router();

// GET /api/search/businesses_and_categories?query=""
search_router.get("/businesses_and_categories", async (req, res, next) => {
  try {
    // combined search endpoint for locations and "search" -> businesses/categories
    const { query } = req.query;
    // grab several categories and businesses with user query, compares with LIKE %query%
    // business only returns once query length > 2
    // 5 categories, 3 businesses
    let [categories, businesses] = await Promise.all([
      getCategoriesByName({ query }),
      getBusinessesByName({ query }),
    ]);
    if (!categories.length && !businesses.length) {
      return res
        .status(400)
        .send({ error: "Invalid business or category search parameter" });
    }
    // remove BigInt count of business from sql query needed for order by

    // add type to categories and business for front end
    categories = categories.map(({ id, name }) => {
      return {
        id,
        name,
        type: "category",
      };
    });

    businesses = businesses.map((business) => {
      return {
        ...business,
        type: "business",
      };
    });

    const search_results = { categories: categories, businesses: businesses };

    res.send({ search_results });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// grab list of locations filtered on location query
// returns 5 matching unique locations with search term filter from db
// GET /search/locations?location="" - filters on iput of city and state
search_router.get("/locations", async (req, res, next) => {
  try {
    const { location } = req.query;
    // limits to 5 by default in return
    let locations = await getBusinessesCityState({ location });
    // remove big int count
    if (!locations.length) {
      return res
        .status(400)
        .send({ error: "Invalid location search parameter" });
    }
    locations = locations.map(({ city, state }) => ({
      city,
      state,
    }));

    res.send({ locations });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = search_router;
