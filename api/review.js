const express = require("express");
const { createReview, editReview, deleteReview } = require("../db/review");
const { checkCreateReviewData } = require("./__utils__/review_utils");
const { getBusinessById, updateBusiness } = require("../db/business");
const { getUserById, updateUser } = require("../db/user");

const review_router = express.Router();

// POST /api/review/business/:business_id
review_router.post(
  "/business/:business_id",
  // check if text & stars were provided
  checkCreateReviewData,
  async (req, res, next) => {
    try {
      const { stars } = req.body;

      const author_id = req.user.id;
      const { business_id } = req.params;

      // find business and user from associated review
      let [business, user] = await Promise.all([
        getBusinessById(business_id),
        getUserById(author_id),
      ]);
      // user is object inside of array, take out object
      user = user[0];
      // add 1 to business review count
      const new_business_review_count = business.review_count + 1;
      /*
       * re average business stars, taking current average * total reviews,
       * add stars given to new review and divide by the new total review count
       * round to nearest half
       */
      const new_business_average_stars =
        Math.round(
          ((business.average_stars * business.review_count + stars) /
            new_business_review_count) *
            2
        ) / 2;

      // add 1 to user review count
      const new_user_review_count = user.review_count + 1;
      /*
       * re average user stars, taking current average * total reviews,
       * add stars given to new review and divide by the new total review count
       *  NOT ROUNDED TO NEAREST HALF
       */
      const new_user_average_stars =
        // parseback to float as toFixed returns string
        parseFloat(
          (
            (user.average_stars * user.review_count + stars) /
            new_user_review_count
          ).toFixed(2)
        );

      /*
       * promise all will either resolve all or fail
       *  so business and user will not be updated if review
       * is not created
       */

      const [updated_business, updated_user, review] = await Promise.all([
        updateBusiness(business_id, {
          average_stars: new_business_average_stars,
          review_count: new_business_review_count,
        }),
        updateUser(author_id, {
          average_stars: new_user_average_stars,
          review_count: new_user_review_count,
        }),
        createReview({
          // req body will have review text and stars for new review
          ...req.body,
          author_id,
          business_id,
        }),
      ]);

      res.status(201).send({ review });
    } catch (error) {
      next({
        name: "CreateReviewFailed",
        message: "Unable to create review",
      });
    }
  }
);

// Include business Id in udpate review endpoint url to not have to do another fetch from db
// PATCH api/review/:review_id/business/:business_id
review_router.patch(
  "/review/:review_id/business/:business_id",
  async (req, res, next) => {
    const { business_id, review_id } = req.params;
    console.log("business_id", business_id);
    console.log("review_id", review_id);
  }
);
// same with delete?

module.exports = review_router;
