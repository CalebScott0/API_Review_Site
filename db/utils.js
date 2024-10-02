const prisma = require("./index");

// average all stars from reviews for a business
const averageBusinessStars = async (business_id) => {
  //   return prisma.$queryRaw`SELECT AVG(stars) FROM review
  //                             WHERE business_id = ${business_id}`;
  const business = await prisma.business.findUnique({
    where: { business_id },
  });
};

module.exports = { averageBusinessStars };
