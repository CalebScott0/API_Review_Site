const prisma = require("./index");

// all categories that have businesses in the db
// order by count business_id to see most popular categories first
const getCategories = () => {
  // return prisma.$queryRaw`SELECT c.*
  //                         FROM categories c
  //                         JOIN category_businesses cb ON c.id = cb.category_id
  //                         GROUP BY c.id`;
  return prisma.$queryRaw`SELECT c.*, COUNT(cb.business_id)
                          FROM categories c
                          JOIN category_businesses cb ON c.id = cb.category_id
                          GROUP BY c.id
                          ORDER BY COUNT(cb.business_id) DESC`;
};

// ORDER BY COUNT (BUSINESS_ID) TO GRAB TOP 5 OPTIONS
// limit for search
// ILIKE for case insensitive search
const getCategoriesByName = ({ query, limit = 5 }) => {
  return prisma.$queryRaw`SELECT c.*, COUNT(cb.business_id) as business_count
                        FROM categories c
                        JOIN category_businesses cb ON c.id = cb.category_id
                        WHERE c.name ILIKE ${`${query}%`}
                        GROUP BY c.id
                        ORDER BY business_count DESC
                        LIMIT ${limit}`;
};

// categories for a specific business
const getCategoriesForBusiness = (business_id) => {
  return prisma.$queryRaw`SELECT c.* FROM categories c
                          JOIN category_businesses cb ON c.id = cb.category_id
                          WHERE cb.business_id = ${business_id}`;
};

module.exports = {
  getCategories,
  getCategoriesByName,
  getCategoriesForBusiness,
};
