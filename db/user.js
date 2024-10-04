const prisma = require("./index");

const createUser = (data) => {
  return prisma.user.create({ data });
};

const getUserById = (id) => {
  return prisma.$queryRaw`SELECT * FROM "user"
                        WHERE id = ${id}`;
  /*
   *return prisma.user.findUnique({
   *  where: { id },
   *});
   */
};

const getUserByUsername = (username) => {
  return prisma.$queryRaw`SELECT * FROM "user"
                        WHERE username = ${username}`;
};
const getUserByEmail = (email) => {
  return prisma.$queryRaw`SELECT * FROM "user"
                        WHERE id = ${id}`;
};

const updateUser = (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

const incrementUserCommentCount = (id) => {
  return prisma.user.update({
    where: { id },
    data: {
      comment_count: {
        increment: 1,
      },
    },
  });
};
const decrementUserCommentCount = (id) => {
  return prisma.user.update({
    where: { id },
    data: {
      comment_count: {
        decrement: 1,
      },
    },
  });
};

module.exports = {
  createUser,
  decrementUserCommentCount,
  incrementUserCommentCount,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  updateUser,
};
