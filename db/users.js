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
