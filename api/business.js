const express = require("express");
const business_router = express.Router();
const {
  getAllBusinesses,
  getBusinessByCategory,
  getBusinessById,
} = require("../db/business");

// GET /api/business/:id
business_router.get("/:id", async (req, res, next) => {
  try {
    const business = await getBusinessById(req.params.id);

    res.send({ business });
  } catch (error) {
    next({
      name: "BusinessNotFound",
      message: "Unable to find Business, check id is valid",
    });
  }
});

module.exports = business_router;
