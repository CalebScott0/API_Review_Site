const prisma = require("./index");

const getPhotosForBusiness = (business_id) => {
  return prisma.photo_business.findMany({
    where: { business_id },
  });
};

module.exports = { getPhotosForBusiness };
