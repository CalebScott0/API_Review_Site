const express = require("express");
const business_router = express.Router();
const {
  getAllBusinessesFromLocation,
  getBusinessesByCategory,
  getBusinessesCityState,
  getBusinessById,
  getBusinessHours,
  getBusinessPhotos,
} = require("../db/businesses");
const { getCategoriesForBusiness } = require("../db/categories");
const { getReviewsForBusiness } = require("../db/reviews");

// GET /api/businesses/:business_id
business_router.get("/:business_id", async (req, res, next) => {
  try {
    const { business_id } = req.params;
    let [business, business_hours, categories] = await Promise.all([
      getBusinessById(business_id),
      getBusinessHours(business_id),
      getCategoriesForBusiness(business_id),
    ]);
    if (categories.length) {
      business = {
        ...business[0],
        hours: business_hours,
        categories,
      };
      // throws error in endpoint
    } else {
      throw new Error();
    }
    res.send({ business });
  } catch (error) {
    next({
      name: "BusinessFetchError",
      message: "Unable to find Business, check id is valid",
    });
  }
});

// // GET api/businesses/locations - returns unique combinations of city and state from db
// business_router.get("/locations", async (req, res, next) => {
//   try {
//     const { query } = req.query;
//     let locations = await getBusinessesCityState({ query });
//     // remove big int count
//     locations = locations.map(({ city, state }) => ({
//       city,
//       state,
//     }));

//     // CREATE MAP FOR CITY AND CLEAN CITY NAME

//     res.send({ locations });
//   } catch ({ name, message }) {
//     next({ name, message });
//   }
// });

// GET api/businesses/nearby?query=city=""&state="" -
// function can take latitude, longitude, and a radius
// has a default in db query
business_router.get("/nearby", async (req, res, next) => {
  try {
    const { limit, offset, city, state } = req.query;
    // get city, state from req query and use location iq api

    const fetch_businesses = await getAllBusinessesFromLocation({
      limit: +limit,
      offset: +offset,
    });
    const businesses = await Promise.all(
      // Get most recent review for busienss (review db query limits to 1 on default and ordered by created_at)
      // get categories for business
      fetch_businesses.map(async ({ id }) => {
        // let [business_hours, categories] = await Promise.all([
        let [review, business_hours, categories] = await Promise.all([
          getReviewsForBusiness({ business_id: id }),
          getBusinessHours(id),
          getCategoriesForBusiness(id),
        ]);
        return {
          ...businesses,
          hours: business_hours,
          categories,
          recent_review: review[0],
        };
      })
    );
    res.send({ businesses });
    // res.send({ business_list });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// Get a list of businesses with a given category_id
// GET /api/businesses/categories/:category_id
business_router.get("/categories/:category_id", async (req, res, next) => {
  try {
    const { category_id } = req.params;
    const { limit, offset } = req.query;
    const fetch_businesses = await getBusinessesByCategory({
      category_id,
      limit: +limit,
      offset: +offset,
    });
    const businesses = await Promise.all(
      // Get most recent review for busienss (review db query limits to 1 on default and ordered by created_at)
      // get categories for business
      fetch_businesses.map(async (business) => {
        // let [business_hours, categories] = await Promise.all([
        let [review, business_hours, categories] = await Promise.all([
          getReviewsForBusiness({ business_id: business.id }),
          getBusinessHours(business.id),
          getCategoriesForBusiness(business.id),
        ]);
        return {
          ...business,
          hours: business_hours,
          categories,
          recent_review: review[0],
        };
      })
    );

    res.send({ businesses });
  } catch (error) {
    next({
      name: "BusinessByCategoryFetchError",
      message:
        "Unable to find businesses by category, check category id is valid",
    });
  }
});

// GET api/businesses/:business_id/reviews
business_router.get("/:business_id/reviews", async (req, res, next) => {
  const { business_id } = req.params;
  const { limit, offset } = req.query;
  try {
    const reviews = await getReviewsForBusiness({
      business_id,
      // parse to int as they will be string from req
      limit: +limit,
      offset: +offset,
    });

    res.send({ reviews });
  } catch (error) {
    next({
      name: "ReviewFetchError",
      message: "Unable to fetch reviews for business",
    });
  }
});

// GET api/businesses/:business_id/photos
business_router.get("/:business_id/photos", async (req, res, next) => {
  const { business_id } = req.params;
  try {
    const photos = await getBusinessPhotos(business_id);

    res.send({ photos });
  } catch (error) {
    next({
      name: "PhotoFetchError",
      message: "Unable to fetch photos for business",
    });
  }
});

module.exports = business_router;
