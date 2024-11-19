const prisma = require("./index");
const uuid = require("uuid");

const createUser = (data) => {
  return prisma.$queryRaw`INSERT INTO users (id, email, first_name, last_name, password)
    VALUES (${uuid.v4()}, ${data.email},
    ${data.firstName[0].toUpperCase() + data.firstName.slice(1)}, ${
    data.lastName[0].toUpperCase() + data.lastName.slice(1)
  }, ${data.password})
    RETURNING *`;
};

const getUserById = (id) => {
  return prisma.$queryRaw`SELECT * FROM users
                        WHERE id = ${id}`;
};

const getUserByEmail = (email) => {
  return prisma.$queryRaw`SELECT * FROM users
                        WHERE email = ${email}`;
};

const updateUserRating = (id, data) => {
  // optionally includes review count on create or delete review
  if (data.review_count >= 0) {
    return prisma.$queryRaw`UPDATE users SET average_stars = ${data.average_stars}, review_count = ${data.review_count}
                          WHERE id = ${id} RETURNING *`;
  } else {
    return prisma.$queryRaw`UPDATE users SET average_stars = ${data.average_stars} 
                            WHERE id = ${id} RETURNING *`;
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserRating,
};
