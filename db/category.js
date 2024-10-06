const prisma = require("./index");

// all categories that have businesses in the db
const getCategories = () => {
  return prisma.$queryRaw`SELECT DISTINCT c.*
                        FROM category c
                        JOIN category_business cb ON c.id = cb.category_id
                        ORDER BY c.name ASC`;
};

// categories for a specific business
const getCategoriesForBusiness = (business_id) => {
  return prisma.$queryRaw`SELECT c.* FROM category c
                          JOIN category_business cb ON c.id = cb.category_id
                          WHERE cb.business_id = ${business_id}`;
};

module.exports = { getCategories, getCategoriesForBusiness };
