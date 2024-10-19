const prisma = require("./index");

const createReview = (data) => {
  return prisma.reviews.create({ data });
};

// will take a review id and a data object
const updateReview = (id, data) => {
  {
    return prisma.reviews.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
  }
};

const deleteReview = (id) => {
  return prisma.reviews.delete({
    where: { id },
  });
};

const getReviewById = (id) => {
  return prisma.$queryRaw`SELECT * FROM reviews
                          WHERE id = ${id}`;
};

// default limit 1 to return most recent
const getReviewsForBusiness = ({ business_id, limit = 1, offset = 0 }) => {
  return prisma.$queryRaw`SELECT r.id, u.first_name, u.last_name, r.author_id,
                          r.business_id, r.stars, r.review_text,
                          r.useful, r.funny, r.cool, r.created_at, r.updated_at
                          FROM reviews r
                          JOIN users u ON r.author_id = u.id
                          WHERE business_id = ${business_id}
                          ORDER BY created_at DESC
                          LIMIT ${limit} OFFSET ${offset}`;
};

const getReviewsForUser = ({ user_id, limit = 10, offset = 0 }) => {
  return prisma.$queryRaw`SELECT r.id, u.first_name, u.last_name, r.author_id,
                          r.business_id, r.stars, r.review_text,
                          r.useful, r.funny, r.cool, r.created_at, r.updated_at
                          FROM reviews r
                          JOIN users u ON r.author_id = u.id
                          WHERE author_id = ${user_id}
                          ORDER BY created_at DESC
                          LIMIT ${limit} OFFSET ${offset}`;
};

const getUserReviewByBusiness = (user_id, business_id) => {
  return prisma.$queryRaw`SELECT * FROM reviews
                          WHERE author_id = ${user_id}
                          AND business_id = ${business_id}`;
};

module.exports = {
  createReview,
  deleteReview,
  getReviewById,
  getReviewsForBusiness,
  getReviewsForUser,
  getUserReviewByBusiness,
  updateReview,
};
