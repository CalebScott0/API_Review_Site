const { getReviewById, getUserReviewByBusiness } = require("../../db/reviews");

const checkCreateReviewData = async (req, res, next) => {
  const { reviewText, stars } = req.body;
  if (!reviewText || !stars || stars > 5) {
    return res.status(400).send({
      message: "Please provide text and a rating (1-5) for review",
    });
  }

  next();
};

// checks update review function has text and/or star rating
const checkUpdateReviewData = async (req, res, next) => {
  const { reviewText, stars } = req.body;
  // error to avoid accidentally removing review_text during update
  // checks if review_text key was provided in req.body obj then if length = 0
  if (stars && reviewText?.length === 0) {
    return res.status(400).send({
      message: "Text value cannot be empty for review",
    });
  }
  if ((!reviewText && !stars) || stars > 5) {
    return res.status(400).send({
      message: "Please update the text or rating (1-5) for review",
    });
  }

  next();
};

// check if user has review for business already
// req.user will be set with token, businessId from endpoint param
const checkUserHasReview = async (req, res, next) => {
  const user_id = req.user.id;
  const { business_id } = req.params;

  const hasReview = (await getUserReviewByBusiness(user_id, business_id))[0];

  if (hasReview) {
    return res.status(409).send({
      name: "DuplicateUserReviewError",
      message: "User already has review for this business",
    });
  }

  next();
};

// check if user is author of review before update or delete
const checkIsUserReview = async (req, res, next) => {
  const { author_id } = (await getReviewById(req.params.review_id))[0];
  if (req.user.id !== author_id) {
    return res
      .status(400)
      .send({ message: "User is not the author of this review" });
  }
  next();
};

module.exports = {
  checkCreateReviewData,
  checkIsUserReview,
  checkUpdateReviewData,
  checkUserHasReview,
};
