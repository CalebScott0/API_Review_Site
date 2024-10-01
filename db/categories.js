const prisma = require("./index");

// all categories that have businesses in the db
const getCategories = () => {
  return prisma.$queryRaw`SELECT DISTINCT category_id, category_name
                        FROM category_business
                        ORDER BY category_name ASC`;
};

// categories for a specific business
const getCategoriesForBusiness = (business_id) => {
  return prisma.$queryRaw`SELECT category_id, category_name
                            FROM category_business
                            WHERE business_id = ${business_id}`;
};

module.exports = { getCategories, getCategoriesForBusiness };
