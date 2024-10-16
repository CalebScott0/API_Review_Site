const prisma = require("./index");

const getBusinessById = (id) => {
  return prisma.$queryRaw`SELECT id, "name", average_stars, review_count, address, city, postal_code, state, is_open, ST_AsText(location) AS location FROM business
                        WHERE id = ${id}`;
};

// default coordinates Indianapolis, IN with default radius 10mi.
const LATITUDE = 39.7683331;
const LONGITUDE = -86.1583502;
const RADIUS = 16093.4;

const getAllBusinessesFromLocation = (
  latitude = LATITUDE,
  longitude = LONGITUDE,
  radius = RADIUS,
  limit = 10,
  offset = 0
) => {
  // wrap location in ST_AsText to turn geometry type into string
  return prisma.$queryRaw`SELECT id, "name", average_stars, review_count, address, city, postal_code, state, is_open, ST_AsText(location) AS location FROM business 
  WHERE ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint(${latitude},${longitude}), 4326), ${radius}) LIMIT ${limit} OFFSET ${offset};`;
  // where (spacial type) distance is within a radius from the created spatial reference system id geo point from input lat and lon, 4326 = coordinate system,
};

const getBusinessesByCategory = ({ category_id, limit = 10, offset = 0 }) => {
  return prisma.$queryRaw`SELECT id, "name", average_stars, review_count, address, city, postal_code, state, is_open, ST_AsText(location) AS location FROM business b
                          JOIN category_business cb ON b.id = cb.business_id
                          WHERE cb.category_id = ${category_id}
                          LIMIT ${limit} OFFSET ${offset}
                          ORDER BY average_stars DESC, review_count DESC`;
};

// from end point, db query will receive a business Id as well as an updated average_stars and/or review_count on review functions
const updateBusiness = (id, data) => {
  return prisma.business.update({
    where: { id },
    data,
  });
};

const getBusinessHours = (id) => {
  return prisma.$queryRaw`SELECT day_of_week, close_time, open_time from business_hours
                          WHERE business_id = ${id}`;
};

const getBusinessesCityState = () => {
  return prisma.$queryRaw`SELECT DISTINCT city, state FROM business;`;
};

// for search, match business by start of name - only if user has typed more than 2 letters
const getBusinessesByName = (name) => {
  if (name.length < 2) return [];

  return prisma.$queryRaw`SELECT id, "name", average_stars, review_count, address, city, postal_code, state, is_open, ST_AsText(location) AS location 
                          FROM business
                          WHERE "name" LIKE ${name}%`;
};

module.exports = {
  getAllBusinessesFromLocation,
  getBusinessesCityState,
  getBusinessesByCategory,
  getBusinessById,
  getBusinessesByName,
  getBusinessHours,
  updateBusiness,
};
