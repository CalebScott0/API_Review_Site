const express = require("express");
const business_router = express.Router();
const {
  getAllBusinesses,
  getBusinessesByCategory,
  getBusinessById,
} = require("../db/business");
const { getCategoriesForBusiness } = require("../db/category");
const { getReviewsForBusiness } = require("../db/review");

// GET /api/business/:id
business_router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    let [business, categories] = await Promise.all([
      getBusinessById(id),
      getCategoriesForBusiness(id),
    ]);
    if (categories.length) {
      business = {
        ...business[0],
        categories: categories.map((x) => x.name),
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

// Get a list of businesses with a given category_id
// GET /api/business/category/:category_id
business_router.get("/category/:category_id", async (req, res, next) => {
  try {
    const { category_id } = req.params;
    const get_businesses = await getBusinessesByCategory({
      category_id,
    });
    const businesses = await Promise.all(
      // Get most recent review for busienss (review db query limits to 1 on default and ordered by created_at)
      // get categories for business
      get_businesses.map(async (business) => {
        let [review, categories] = await Promise.all([
          getReviewsForBusiness({ business_id: business.id }),
          getCategoriesForBusiness(business.id),
        ]);
        return {
          ...business,
          categories,
          recent_review: review,
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

business_router.get("/reviews/:business_id", async (req, res, next) => {
  const { limit, offset } = req.query;
  const { business_id } = req.params;
  console.log(business_id);
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
  // LOOK AT CAPSTONE API FOLDER FOR
  // REQUEST PARAMETERS WITH LIMIT AND INDEX
});

module.exports = business_router;
