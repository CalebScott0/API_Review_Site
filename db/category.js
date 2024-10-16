const prisma = require("./index");

// all categories that have businesses in the db
// order by count business_id to see most popular categories first
const getCategories = () => {
  return prisma.$queryRaw`SELECT c.*, COUNT(cb.business_id)
                          FROM category c
                          JOIN category_business cb ON c.id = cb.category_id
                          GROUP BY c.id
                          ORDER BY COUNT(cb.business_id) DESC`;
  // ORDER BY c.name ASC`;
};

// ORDER BY COUNT (BUSINESS_ID) TO GRAB TOP 3-4 OPTIONS
// limit for search
const getCategoriesByName = ({ query, limit = 5 }) => {
  return prisma.$queryRaw`SELECT c.*, COUNT(cb.business_id)
                        FROM category c
                        JOIN category_business cb ON c.id = cb.category_id
                        WHERE c.name LIKE ${`${query}%`}
                        GROUP BY c.id
                        ORDER BY COUNT(cb.business_id) DESC
                        LIMIT ${limit}`;
};

// categories for a specific business
const getCategoriesForBusiness = async (business_id) => {
  return prisma.$queryRaw`SELECT c.* FROM category c
                          JOIN category_business cb ON c.id = cb.category_id
                          WHERE cb.business_id = ${business_id}`;
};

module.exports = {
  getCategories,
  getCategoriesByName,
  getCategoriesForBusiness,
};
