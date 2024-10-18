const prisma = require("./index");

// ST_ASText to convert from geometry type to string
const getBusinessById = (id) => {
  return prisma.$queryRaw`SELECT id, "name", average_stars, review_count, address, city, postal_code, state, is_open, ST_AsText(location) AS location 
                          FROM business
                          WHERE id = ${id}`;
};

// default coordinates Indianapolis, IN with default radius 10mi.
const LATITUDE = 39.7683331;
const LONGITUDE = -86.1583502;
const RADIUS = 16093.4;

const getAllBusinessesFromLocation = ({
  latitude = 39.7683331,
  longitude = -86.1583502,
  radius = 16093.4,
  limit = 10,
  offset = 0,
}) => {
  // console.log(longitude);
  // wrap location in ST_AsText to turn geometry type into string
  // where (spacial type) distance is within a rxadius from the created spatial reference system id geo point from input lat and lon, 4326 = coordinate system,
  //LONGITUDE BEFORE LATITUDE IN SPATIAL QUERIES WHERE YOU MAKE A POINT
  return prisma.$queryRaw`SELECT id, "name", average_stars, review_count, address, city, postal_code, state, is_open, ST_AsText(location) AS location FROM business
                          WHERE ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint(${longitude},${latitude}), 4326), ${radius}) 
                          ORDER BY review_count DESC, average_stars DESC
                          LIMIT ${limit} OFFSET ${offset};`;
};

const getBusinessesByCategory = ({ category_id, limit = 10, offset = 0 }) => {
  return prisma.$queryRaw`SELECT id, "name", average_stars, review_count, address, city, postal_code, state, is_open, ST_AsText(location) AS location 
                          FROM business b
                          JOIN category_business cb ON b.id = cb.business_id
                          WHERE cb.category_id = ${category_id}
                          ORDER BY review_count DESC, average_stars DESC
                          LIMIT ${limit} OFFSET ${offset};`;
};

const getBusinessHours = (id) => {
  return prisma.$queryRaw`SELECT day_of_week, close_time, open_time from business_hours
                          WHERE business_id = ${id}`;
};

// return locations filtered with user search query
const getBusinessesCityState = ({ query, limit = 5 }) => {
  // if query includes a state
  if (query.indexOf(",") > 0) {
    const city = query.slice(0, query.indexOf(","));
    const state = query.slice(query.indexOf(",") + 1).trim();
    return prisma.$queryRaw`SELECT DISTINCT city, state, COUNT(id) as business_count FROM business
                            WHERE city ILIKE ${`${city}%`}
                            AND state ILIKE ${`${state}%`}
                            GROUP BY city, state
                            ORDER BY business_count DESC
                            LIMIT ${limit}`;
  } else {
    // on input that does not yet include a state
    return prisma.$queryRaw`SELECT DISTINCT city, state, COUNT(id) as business_count FROM business
                            WHERE city ILIKE ${`${query}%`}
                            GROUP BY city, state
                            ORDER  BY business_count DESC
                            LIMIT ${limit}`;
  }
};

// for search, match business by start of name - only if user has typed more than 2 letters
// ILIKE for case insensitive search
const getBusinessesByName = ({ query, limit = 3 }) => {
  if (query.length < 2) return [];

  return prisma.$queryRaw`SELECT id, "name", average_stars, review_count, address, city, state
                          FROM business
                          WHERE "name" ILIKE ${`${query}%`}
                          ORDER BY review_count DESC, average_stars DESC
                          LIMIT ${limit}`;
};

// from end point, db query will receive a business Id as well as an updated average_stars and/or review_count on review functions
const updateBusiness = (id, data) => {
  return prisma.business.update({
    where: { id },
    data,
  });
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
