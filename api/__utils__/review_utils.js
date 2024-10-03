const checkCreateReviewData = async (req, res, next) => {
  const { review_text, stars } = req.body;
  if (!review_text || !stars || stars > 5) {
    return res.status(400).send({
      message: "Please provide text and a stars rating (1-5) for review",
    });
  }

  next();
};

module.exports = {
  checkCreateReviewData,
};
