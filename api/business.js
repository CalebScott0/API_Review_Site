const express = require("express");
const business_router = express.Router();
const {
  getAllBusinesses,
  getBusinessesByCategory,
  getBusinessById,
} = require("../db/business");

// GET /api/business/:id
business_router.get("/:id", async (req, res, next) => {
  try {
    const business = await getBusinessById(req.params.id);

    res.send({ business });
  } catch (error) {
    next({
      name: "BusinessFetchError",
      message: "Unable to find Business, check id is valid",
    });
  }
});

// GET /api/business/category/:category_id
business_router.get("/category/:category_id", async (req, res, next) => {
  try {
    const { category_id } = req.params;
    const businesses = await getBusinessesByCategory({
      category_id,
    });

    res.send({ businesses });
  } catch (error) {
    next({
      name: "BusinessByCategoryFetchError",
      message:
        "Unable to find businesses by category, check category id is valid",
    });
  }
});
module.exports = business_router;
