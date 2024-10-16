const prisma = require("./index");

// all categories that have businesses in the db
// order by count business_id to see most popular categories first
const getCategories = () => {
  return prisma.$queryRaw`SELECT DISTINCT c.*
                        FROM category c
                        JOIN category_business cb ON c.id = cb.category_id
                        ORDER BY COUNT(cb.business_id) DESC`;
  // ORDER BY c.name ASC`;
};

const getCategoriesByName = ({ query }) => {
  // oRDER BY COUNT (BUSINESS_ID) TO GRAB TOP 3-4 OPTIONS
  // take 3-4~ or slice out in endpoint?
  return prisma.$queryRaw`SELECT DISTINCT c.*
                        FROM category c
                        JOIN category_business cb ON c.id = cb.category_id
                        where c.name LIKE ${query}%
                        ORDER COUNT(cb.business_id) DESC`;
};

// categories for a specific business
const getCategoriesForBusiness = async (business_id) => {
  return prisma.$queryRaw`SELECT c.* FROM category c
                          JOIN category_business cb ON c.id = cb.category_id
                          WHERE cb.business_id = ${business_id}`;
};

module.exports = { getCategories, getCategoriesForBusiness };
