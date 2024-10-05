const prisma = require("./index");

const getBusinessById = async (id) => {
  const [business, categories] = await Promise.all([
    prisma.$queryRaw`SELECT * FROM business
                        WHERE id = ${id}`,
    prisma.$queryRaw`SELECT category_name FROM category_business
                    WHERE business_id = ${id}`,
  ]);
  // return object with business and associated categories
  //  without check, categories will always exist even if empty array
  if (categories.length) {
    return {
      ...business[0],
      categories: categories.map((x) => x.category_name),
    };
    // throws error in endpoint
  } else {
    throw new Error();
  }
};

const getAllBusinesses = () => {
  return prisma.$queryRaw`SELECT id, "name" FROM business`;
};

const getBusinessByCategory = ({
  category_name,
  start_index = 0,
  limit = 10,
}) => {
  return prisma.$queryRaw`EXPLAIN ANALYZE SELECT DISTINCT b.* FROM business b
                        JOIN category_business c ON c.business_id = b.id
                        WHERE category_name = ${category_name}
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
  getBusinessByCategory,
  getBusinessById,
  updateBusiness,
};
