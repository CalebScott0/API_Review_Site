const { getCategoriesByName } = require("../db/categories");

const {
  getBusinessesByName,
  getBusinessesCityState,
} = require("../db/businesses");
const express = require("express");
const search_router = express.Router();

// get /api/search?search=""
// get /api/search?location=""
search_router.use("/", async (req, res, next) => {
  try {
    // combined search endpoint for locations and "search" -> businesses/categories
    const { search, location } = req.query;
    if (search) {
      // grab several categories and businesses with user query, compares with LIKE %query%
      // business only returns once query length > 2
      // 5 categories, 3 businesses
      let [categories, businesses] = await Promise.all([
        getCategoriesByName({ query: search }),
        getBusinessesByName({ query: search }),
      ]);
      // // remove BigInt count of business from sql query needed for order by
      categories = categories.map(({ id, name }) => {
        return {
          id,
          name,
        };
      });
      const search_results = { categories: categories, businesses: businesses };

      res.send({ search_results });

      // change this to be city and state distinct in query?
    } else if (location) {
      // grab list of locations filtered on location query
      // limits to 5 by default in return
      let locations = await getBusinessesCityState({ query: location });
      // remove big int count
      locations = locations.map(({ city, state }) => ({
        city,
        state,
      }));
      res.send({ locations });
    } else
      res
        .status(400)
        .send({ error: "Please provide search or location query" });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = search_router;
