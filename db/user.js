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
                        WHERE email = ${email}`;
};

const updateUser = (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  updateUser,
};
