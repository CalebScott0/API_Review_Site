const prisma = require("./index");

const createUser = (data) => {
  return prisma.users.create({ data });
};

const getUserById = (id) => {
  return prisma.$queryRaw`SELECT * FROM users
                        WHERE id = ${id}`;
};

const getUserByEmail = (email) => {
  return prisma.$queryRaw`SELECT * FROM users
                        WHERE email = ${email}`;
};

const updateUser = (id, data) => {
  return prisma.users.update({
    where: { id },
    data,
  });
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
};
