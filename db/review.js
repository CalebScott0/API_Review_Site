const prisma = require("./index");

const createReview = (data) => {
  return prisma.review.create({ data });
};

// will take a review id and a data object
const editReview = (id, data) => {
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

const deleteReview = (id) => {
  return prisma.review.delete({
    where: { id },
  });
};

const getReviewById = (id) => {
  return prisma.$queryRaw`SELECT * FROM review
                          WHERE id = ${id}`;
};

module.exports = {
  createReview,
  deleteReview,
  editReview,
  getReviewById,
};
