const prisma = require("./index");
const uuid = require("uuid");

const createReview = (data) => {
  return prisma.$queryRaw`INSERT INTO reviews (id, review_text, stars, author_id, business_id)
    VALUES (${uuid.v4()}, ${data.review_text}, ${data.stars}, ${
    data.author_id
  }, ${data.business_id}) RETURNING *`;
  // return prisma.reviews.create({ data });
};

// will take a review id and a data object - can have just review text or also include a new rating for review
const updateReview = (id, data) => {
  // if both review_text and new stars rating
  if (data.stars) {
    return prisma.$queryRaw`UPDATE reviews
                          SET review_text = ${data.review_text}, stars = ${data.stars}
                          WHERE id = ${id} RETURNING *`;
  } else {
    return prisma.$queryRaw`UPDATE reviews
                            SET review_text = ${data.review_text}
                            WHERE id = ${id} RETURNING *`;
  }
};

const deleteReview = (id) => {
  return prisma.$queryRaw`DELETE FROM reviews
                          WHERE id = ${id}`;
};

const getReviewById = (id) => {
  return prisma.$queryRaw`SELECT * FROM reviews
                          WHERE id = ${id}`;
};

// default limit 1 to return most recent
const getReviewsForBusiness = ({ business_id, limit = 1, page = 1 }) => {
  const offset = (page - 1) * limit;
  return prisma.$queryRaw`SELECT r.id, u.first_name as author_first_name, u.last_name as author_last_name, u.review_count AS author_review_count,
                          u.friend_count AS author_friend_count, r.author_id, r.business_id, r.stars, r.review_text,
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
  return prisma.$queryRaw`SELECT r.id, u.first_name, u.last_name,
                          u.review_count AS review_count,
                          u.friend_count AS friend_count, 
                          r.author_id, r.business_id, r.stars, r.review_text,
                          r.useful, r.funny, r.cool, r.created_at, r.updated_at
                          FROM reviews r
                          JOIN users u ON r.author_id = u.id
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
