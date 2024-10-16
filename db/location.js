const getBusinessLocations = () => {
  return prisma.$queryRaw`SELECT DISTINCT city, state FROM business;`;
};

module.exports = {
  getBusinessLocations,
};
