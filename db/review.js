const prisma = require("./index");

const createReview = (data) => {
  return prisma.review.create({ data });
};

// will take a review id and a data object
const updateReview = (id, data) => {
  {
    return prisma.review.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
  }
};

const incrementReviewCommentCount = (id) => {
  return prisma.review.update({
    where: { id },
    data: {
      comment_count: {
        increment: 1,
      },
    },
  });
};
const decrementReviewCommentCount = (id) => {
  return prisma.review.update({
    where: { id },
    data: {
      comment_count: {
        decrement: 1,
      },
    },
  });
};

const deleteReview = (id) => {
  return prisma.review.delete({
    where: { id },
  });
};

const getReviewById = (id) => {
  return prisma.$queryRaw`SELECT * FROM review
                          WHERE id = ${id}`;
};

const getUserReviewByBusiness = (author_id, business_id) => {
  return prisma.$queryRaw`SELECT * FROM review
                          WHERE author_id = ${author_id}
                          AND business_id = ${business_id}`;
};

module.exports = {
  createReview,
  decrementReviewCommentCount,
  deleteReview,
  getReviewById,
  getUserReviewByBusiness,
  incrementReviewCommentCount,
  updateReview,
};
