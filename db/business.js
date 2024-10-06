const prisma = require("./index");
const { getCategoriesForBusiness } = require("./category");

const getBusinessById = async (id) => {
  const [business, categories] = await Promise.all([
    prisma.$queryRaw`SELECT * FROM business
                        WHERE id = ${id}`,
    getCategoriesForBusiness(id),
    // REPLACE WITH GET CATEGORIES FOR BUSINESS QUERY
    // prisma.$queryRaw`SELECT * FROM category c
    //                 LEFT JOIN category_business cb ON c.id = cb.category_id
    //                 WHERE cb.business_id = ${id}`,
  ]);
  // return object with business and associated categories
  //  without check, categories will always exist even if empty array
  if (categories.length) {
    return {
      ...business[0],
      categories: categories.map((x) => x.name),
    };
    // throws error in endpoint
  } else {
    throw new Error();
  }
};

const getAllBusinesses = () => {
  return prisma.$queryRaw`SELECT id, "name" FROM business`;
};

const getBusinessesByCategory = ({
  category_id,
  start_index = 0,
  limit = 10,
}) => {
  return prisma.$queryRaw`SELECT DISTINCT b.* FROM business b
                        JOIN category_business cb ON b.id = cb.business_id
                        WHERE category_id = ${category_id}
                        ORDER BY average_stars DESC, review_count DESC
                        LIMIT ${limit} OFFSET ${start_index}`;
};

// from end point, db query will receive a business Id as well as an updated average_stars and/or review_count
const updateBusiness = (id, data) => {
  return prisma.business.update({
    where: { id },
    data,
  });
};

module.exports = {
  getAllBusinesses,
  getBusinessesByCategory,
  getBusinessById,
  updateBusiness,
};
