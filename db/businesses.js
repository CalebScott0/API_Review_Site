const prisma = require("./index");

const getBusinessById = async (id) => {
  const [business, categories] = await Promise.all([
    prisma.$queryRaw`SELECT * FROM business
                        WHERE id = ${id}`,
    prisma.$queryRaw`SELECT category_name FROM category_business
                    WHERE business_id = ${id}`,
  ]);
  // return object with business and associated categories
  return {
    ...business[0],
    categories: categories.map((x) => x.category_name),
  };
};

const getAllBusinesses = () => {
  return prisma.$queryRaw`SELECT id, "name" FROM business`;
};

const getBusinessByCategory = ({
  category_name,
  start_index = 0,
  limit = 10,
}) => {
  console.log(category_name);
  return prisma.$queryRaw`SELECT DISTINCT b.* FROM business b
                        JOIN category_business c ON c.business_id = b.id
                        WHERE category_name = ${category_name}
                        ORDER BY average_stars DESC, review_count DESC
                        LIMIT ${limit} OFFSET ${start_index}`;
};

module.exports = { getAllBusinesses, getBusinessByCategory, getBusinessById };
