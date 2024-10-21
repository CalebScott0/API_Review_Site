const prisma = require("./index");

// ST_ASText to convert from geometry type to string
const getBusinessById = (business_id) => {
  return prisma.$queryRaw`SELECT id, "name", average_stars, review_count, address, city, postal_code, state, is_open, ST_AsText(location) AS location 
                          FROM businesses
                          WHERE id = ${business_id}`;
};

const getAllBusinessesFromLocation = ({
  longitude,
  latitude,
  // default radius 10mi - in km
  radius = 16093.4,
  limit = 10,
  offset = 0,
}) => {
  // wrap location in ST_AsText to turn geometry type into string
  // where (spacial type) distance is within a rxadius from the created spatial reference system id geo point from input lat and lon, 4326 = coordinate system,
  //LONGITUDE BEFORE LATITUDE IN SPATIAL QUERIES WHERE YOU MAKE A POINT
  return prisma.$queryRaw`SELECT id, "name", average_stars, review_count, address, city, postal_code, state, is_open, longitude, latitude
                          FROM businesses
                          WHERE ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint(${longitude},${latitude}), 4326), ${radius}) 
                          ORDER BY review_count DESC
                          LIMIT ${limit} OFFSET ${offset};`;
};

const getBusinessesByCategoryFromLocation = ({
  category_id,
  longitude,
  latitude,
  limit = 10,
  offset = 0,
}) => {
  // ST_DistanceSphere to calculate distance from target coordinates - return will be in meters
  return prisma.$queryRaw`SELECT b.id, b."name", b.average_stars, b.review_count, b.address, b.city, b.postal_code, b.state, b.is_open, b.longitude, b.latitude,
                          ST_DistanceSphere(ST_MakePoint(${longitude}, ${latitude}), ST_ASText(location)::geometry)
                          AS distance_from_location
                          FROM businesses b
                          JOIN category_businesses cb ON b.id = cb.business_id
                          WHERE cb.category_id = ${category_id}
                          ORDER BY review_count DESC, average_stars DESC
                          LIMIT ${limit} OFFSET ${offset};`;
};

// Use this for the filter by highest review count!
// ADD ANOTHER FOR FILTER BY AVERAGE STARS FOR BEST BUSINESSES
//     YOU WOULD HAVE TO CHANGE BUSINESSES BACK TO ROUDNED TO NEAREST HALF FOR AVERAGES STARS IN DB FOR THIS TO BE EFFECTIVE
const getBusinessesByCategory = ({ category_id, limit = 10, offset = 0 }) => {
  return prisma.$queryRaw`SELECT b.id, b."name", b.average_stars, b.review_count, b.address, b.city, b.postal_code, b.state, b.is_open, ST_AsText(location) AS location
                            FROM businesses b
                            JOIN category_businesses cb ON b.id = cb.business_id
                            WHERE cb.category_id = ${category_id}
                            ORDER BY review_count DESC, average_stars DESC
                            LIMIT ${limit} OFFSET ${offset};`;
};

const getBusinessHours = (business_id) => {
  return prisma.$queryRaw`SELECT day_of_week, close_time, open_time from business_hours
                          WHERE business_id = ${business_id}`;
};

const getBusinessPhotos = (business_id) => {
  return prisma.$queryRaw`SELECT * FROM business_photos
                          WHERE business_id = ${business_id}`;
};

// return locations filtered with user search query
const getBusinessesCityState = ({ location, limit = 5 }) => {
  // if location includes a state
  if (location?.indexOf(",") > 0) {
    const city = location.slice(0, location.indexOf(","));
    const state = location.slice(location.indexOf(",") + 1).trim();
    return prisma.$queryRaw`SELECT DISTINCT city, state, COUNT(id) as business_count FROM businesses
                            WHERE city ILIKE ${`${city}%`}
                            AND state ILIKE ${`${state}%`}
                            GROUP BY city, state
                            ORDER BY business_count DESC
                            LIMIT ${limit}`;
  } else {
    // on input that does not yet include a state
    return prisma.$queryRaw`SELECT DISTINCT city, state, COUNT(id) as business_count FROM businesses
                            WHERE city ILIKE ${`${location}%`}
                            GROUP BY city, state
                            ORDER  BY business_count DESC
                            LIMIT ${limit}`;
  }
};

// for search, match businesses by start of name - only if user has typed more than 2 letters
// ILIKE for case insensitive search
const getBusinessesByName = ({ query, limit = 3 }) => {
  if (query.length < 2) return [];

  return prisma.$queryRaw`SELECT id, "name", average_stars, review_count, address, city, state
                          FROM businesses
                          WHERE "name" ILIKE ${`${query}%`}
                          ORDER BY review_count DESC, average_stars DESC
                          LIMIT ${limit}`;
};

// from end point, db query will receive a businesses Id as well as an updated average_stars and/or review_count on review functions
const updateBusiness = (id, data) => {
  return prisma.businesses.update({
    where: { id },
    data,
  });
};

module.exports = {
  getAllBusinessesFromLocation,
  getBusinessesCityState,
  getBusinessesByCategory,
  getBusinessesByCategoryFromLocation,
  getBusinessById,
  getBusinessesByName,
  getBusinessHours,
  getBusinessPhotos,
  updateBusiness,
};
