const express = require("express");
const {
  decrementReviewCommentCount,
  incrementReviewCommentCount,
} = require("../db/review");
const {
  decrementUserCommentCount,
  incrementUserCommentCount,
} = require("../db/user");
const { createComment, updateComment } = require("../db/comment");

const comment_router = express.Router();

// POST /api/comment/review/:review_id
comment_router.post("/review/:review_id", async (req, res, next) => {
  try {
    const author_id = req.user.id;
    const { review_id } = req.params;
    const { comment_text } = req.body;

    // update user and review with + 1 comment count
    const [updated_review, updated_user, comment] = await Promise.all([
      incrementReviewCommentCount(review_id),
      incrementUserCommentCount(author_id),
      createComment({
        comment_text,
        author_id,
        review_id,
      }),
    ]);
    console.log("user", updated_user);
    console.log("review", updated_review);

    res.status(201).send({ comment });
  } catch (error) {
    next({
      name: "CreateCommentFailed",
      message: "Unable to create comment",
    });
  }
});

// /api/comment/:comment_id
comment_router.put("/:comment_id", async (req, res, next) => {
  try {
    console.log(req.body);
    const updated_comment = await updateComment(
      req.params.comment_id,
      req.body.comment_text
    );
    res.status(201).send({ updated_comment });
  } catch (error) {
    next({
      name: "UpdateCommentFailed",
      message: "Unable to update comment",
    });
  }
});

module.exports = comment_router;
