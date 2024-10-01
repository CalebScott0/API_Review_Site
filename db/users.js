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
  return prisma.user.findUnique({
    where: { username },
  });
};
const getUserByEmail = (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

module.exports = { createUser, getUserByEmail, getUserById, getUserByUsername };
