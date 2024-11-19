const express = require("express");
const {
  createReview,
  deleteReview,
  getReviewById,
  updateReview,
} = require("../db/reviews");
const {
  checkCreateReviewData,
  checkIsUserReview,
  checkUpdateReviewData,
  checkUserHasReview,
} = require("./__utils__/review_utils");
const { getBusinessById, updateBusinessRating } = require("../db/businesses");
const { averageBusinessStars, averageUserStars } = require("../db/utils");
const { getUserById, updateUserRating } = require("../db/users");
const { getReviewsForBusiness } = require("../db/reviews");
const { ChecksumAlgorithm } = require("@aws-sdk/client-s3");

const reviews_router = express.Router();

// POST /api/reviews/business/:business_id
reviews_router.post(
  "/business/:business_id",
  // check if text & stars were provided
  checkCreateReviewData,
  // check if user already has a review on provided business id
  checkUserHasReview,
  async (req, res, next) => {
    try {
      const { reviewText, stars } = req.body;

      const author_id = req.user.id;
      const { business_id } = req.params;
      // find business and user from associated review
      let [business, user] = await Promise.all([
        getBusinessById(business_id),
        getUserById(author_id),
      ]);
      // user/business is object inside of array, take out object
      [user, business] = [user[0], business[0]];

      // add 1 to business review count
      const new_business_review_count = business.review_count + 1;
      /*
       * re average business stars, taking current average * total reviews,
       * add stars given to new review and divide by the new total review count
       * round to nearest half
       */
      const new_business_average_stars = averageBusinessStars(
        business.average_stars,
        business.review_count,
        stars,
        new_business_review_count
      );

      // add 1 to user review count
      const new_user_review_count = user.review_count + 1;
      /*
       * re average user stars, taking current average * total reviews,
       * add stars given to new review and divide by the new total review count
       *  NOT ROUNDED TO NEAREST HALF
       */
      const new_user_average_stars = averageUserStars(
        user.average_stars,
        user.review_count,
        stars,
        new_user_review_count
      );
      /*
       * promise all will either resolve all or fail
       *  so business and user will not be updated if review
       * is not created
       */
      const [updated_business, updated_user, review] = await Promise.all([
        updateBusinessRating(business_id, {
          average_stars: new_business_average_stars,
          review_count: new_business_review_count,
        }),
        updateUserRating(author_id, {
          average_stars: new_user_average_stars,
          review_count: new_user_review_count,
        }),
        createReview({
          // req body will have review text and stars for new review
          review_text: reviewText,
          stars,
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

// Include business Id in udpate/delete review endpoint url to not have to do another fetch from db
// PUT api/reviews/:review_id/business/:business_id
reviews_router.put(
  "/:review_id/business/:business_id",
  // check user is author of this review
  checkIsUserReview,
  // check correct data was given to update review
  checkUpdateReviewData,
  async (req, res, next) => {
    try {
      const { business_id, review_id } = req.params;
      const author_id = req.user.id;
      let { stars } = req.body;

      // only update business and user if a new star rating is given
      if (stars) {
        let [business, user, review] = await Promise.all([
          getBusinessById(business_id),
          getUserById(author_id),
          getReviewById(review_id),
        ]);
        [user, review, business] = [user[0], review[0], business[0]];
        // stars to reaverage should equal new star rating - original rating
        // example: if original review had 5 stars
        //          and new review has 4
        //           you would modify the total stars by - 1
        // this keeps the same equation below with adding stars
        stars -= review.stars;

        // re average business stars with new rating
        const new_business_average_stars = averageBusinessStars(
          business.average_stars,
          business.review_count,
          stars,
          business.review_count
        );

        // re average user stars with new rating
        const new_user_average_stars = averageUserStars(
          user.average_stars,
          user.review_count,
          stars,
          user.review_count
        );

        const [updated_business, updated_user, updated_review] =
          await Promise.all([
            updateBusinessRating(business_id, {
              average_stars: new_business_average_stars,
            }),
            updateUserRating(author_id, {
              average_stars: new_user_average_stars,
            }),
            updateReview(review_id, {
              stars: req.body.stars,
              review_text: req.body.reviewText,
            }),
          ]);

        res.send({ updated_review });
      } else {
        // If no stars in review
        const updated_review = await updateReview(review_id, {
          review_text: req.body.reviewText,
        });

        res.send({ updated_review });
      }
    } catch (error) {
      next({
        name: "UpdateReviewFailed",
        message: "Unable to update review",
      });
    }
  }
);

// DELETE /api/reviews/:review_id/business/:business_id
reviews_router.delete(
  "/:review_id/business/:business_id",
  // check user is author of this review
  checkIsUserReview,
  async (req, res, next) => {
    try {
      const { business_id, review_id } = req.params;
      const author_id = req.user.id;

      let [business, user, review] = await Promise.all([
        getBusinessById(business_id),
        getUserById(author_id),
        getReviewById(review_id),
      ]);
      [user, review, business] = [user[0], review[0], business[0]];

      const new_business_review_count = business.review_count - 1;
      // stars is negative as we are deleting
      const stars = -review.stars;

      const new_business_average_stars = averageBusinessStars(
        business.average_stars,
        business.review_count,
        stars,
        new_business_review_count
      );

      const new_user_review_count = user.review_count - 1;
      const new_user_average_stars = averageUserStars(
        user.average_stars,
        user.review_count,
        stars,
        new_user_review_count
      );

      // DELETE ASSIGNMENT TO VARIABLE AFTER TESTING IT WORKS
      await Promise.all([
        updateBusinessRating(business_id, {
          review_count: new_business_review_count,
          average_stars: new_business_average_stars,
        }),
        updateUserRating(author_id, {
          review_count: new_user_review_count,
          average_stars: new_user_average_stars,
        }),
        deleteReview(review_id),
      ]);
      res.sendStatus(204);
    } catch (error) {
      next({
        name: "DeleteReviewFailed",
        message: "Unable to delete review",
      });
    }
  }
);

module.exports = reviews_router;
