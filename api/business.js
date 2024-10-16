const express = require("express");
const business_router = express.Router();
const {
  getAllBusinessesFromLocation,
  getBusinessesByCategory,
  getBusinessById,
  getBusinessHours,
  getBusinessesCityState,
} = require("../db/business");
const { getCategoriesForBusiness } = require("../db/category");
const { getReviewsForBusiness } = require("../db/review");
const { getPhotosForBusiness } = require("../db/photo");

// GET /api/business/:id
business_router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    let [business, business_hours, categories] = await Promise.all([
      getBusinessById(id),
      getBusinessHours(id),
      getCategoriesForBusiness(id),
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

// GET api/business/list/locations - returns unique combinations of city and state from db
business_router.get("/list/locations", async (req, res, next) => {
  try {
    const { query } = req.query;
    let locations = await getBusinessesCityState({ query });
    // remove big int count
    locations = locations.map(({ city, state }) => ({
      city,
      state,
    }));

    // CREATE MAP FOR CITY AND CLEAN CITY NAME

    res.send({ locations });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET api/business/list/businesses_from_location -
// function can take latitude, longitude, and a radius
// has a default in db query
business_router.get(
  "/list/businesses_from_location",
  async (req, res, next) => {
    try {
      const { limit, offset } = req.query;
      // get city, state from req query and use location iq api

      const businesses = await getAllBusinessesFromLocation({
        limit: +limit,
        offset: +offset,
      });
      // const business_list = await Promise.all(
      //   // Get most recent review for busienss (review db query limits to 1 on default and ordered by created_at)
      //   // get categories for business
      //   businesses.map(async (business) => {
      //     // let [business_hours, categories] = await Promise.all([
      //     let [review, business_hours, categories] = await Promise.all([
      //       getReviewsForBusiness({ business_id: business.id }),
      //       getBusinessHours(business.id),
      //       getCategoriesForBusiness(business.id),
      //     ]);
      //     return {
      //       ...businesses,
      //       hours: business_hours,
      //       categories,
      //       recent_review: review[0],
      //     };
      //   })
      // );

      res.send({ businesses });
      // res.send({ business_list });
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

// Get a list of businesses with a given category_id
// GET /api/business/list/category/:category_id
business_router.get("/list/category/:category_id", async (req, res, next) => {
  try {
    const { category_id } = req.params;
    const { limit, offset } = req.query;
    const businesses = await getBusinessesByCategory({
      category_id,
      limit: +limit,
      offset: +offset,
    });
    const business_list = await Promise.all(
      // Get most recent review for busienss (review db query limits to 1 on default and ordered by created_at)
      // get categories for business
      businesses.map(async (business) => {
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

    res.send({ business_list });
  } catch (error) {
    next({
      name: "BusinessByCategoryFetchError",
      message:
        "Unable to find businesses by category, check category id is valid",
    });
  }
});

// GET api/business/reviews/:busienss_id
business_router.get("/reviews/:business_id", async (req, res, next) => {
  const { business_id } = req.params;
  const { limit, offset } = req.query;
  try {
    const business_reviews = await getReviewsForBusiness({
      business_id,
      // parse to int as they will be string from req
      limit: +limit,
      offset: +offset,
    });

    res.send({ business_reviews });
  } catch (error) {
    next({
      name: "ReviewFetchError",
      message: "Unable to fetch reviews for business",
    });
  }
});

// GET api/business/photos/:business_id
business_router.get("/photos/:business_id", async (req, res, next) => {
  const { business_id } = req.params;
  try {
    const business_photos = await getPhotosForBusiness(business_id);

    res.send({ business_photos });
  } catch (error) {
    next({
      name: "PhotoFetchError",
      message: "Unable to fetch photos for business",
    });
  }
});

module.exports = business_router;
