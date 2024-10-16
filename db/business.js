const prisma = require("./index");

const getBusinessById = (id) => {
  return prisma.$queryRaw`SELECT * FROM business
                        WHERE id = ${id}`;
};

const getAllBusinesses = () => {
  return prisma.$queryRaw`SELECT id, "name" FROM business`;
};

const getBusinessesByCategory = ({ category_id, limit = 10, offset = 0 }) => {
  return prisma.$queryRaw`SELECT DISTINCT b.* FROM business b
                        JOIN category_business cb ON b.id = cb.business_id
                        WHERE category_id = ${category_id}
                        ORDER BY average_stars DESC, review_count DESC
                        LIMIT ${limit} OFFSET ${offset}`;
};

// from end point, db query will receive a business Id as well as an updated average_stars and/or review_count
const updateBusiness = (id, data) => {
  return prisma.business.update({
    where: { id },
    data,
  });
};

const getBusinessHours = (id) => {
  return prisma.$queryRaw`SELECT day_of_week, close_time, open_time from business_hours
                          WHERE business_id = ${id}`;
};

const getBusinessLocations = () => {
  return prisma.$queryRaw`SELECT DISTINCT city, state FROM business;`;
};

module.exports = {
  getAllBusinesses,
  getBusinessesByCategory,
  getBusinessById,
  getBusinessHours,
  updateBusiness,
};
