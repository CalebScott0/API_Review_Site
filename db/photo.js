const prisma = require("./index");

const getPhotosForBusiness = (business_id) => {
  return prisma.$queryRaw`SELECT * FROM photo_business
                          WHERE business_id = ${business_id}`;
};

module.exports = { getPhotosForBusiness };
