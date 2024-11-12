const prisma = require("./index");

// ST_ASText to convert from geometry type to string
const getBusinessById = (business_id) => {
  return prisma.$queryRaw`SELECT id, "name", average_stars, review_count, address, city, postal_code, state, is_open, longitude, latitude 
                          FROM businesses
                          WHERE id = ${business_id}`;
};

// would be used for businesses within a radius (currently does not have category filter)
const getBusinessesFromLocation = ({
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
                          LIMIT ${limit} OFFSET ${offset};
                          `;
};

const getBusinessesByCategoryFromLocation = ({
  category_id,
  longitude,
  latitude,
  limit = 10,
  page = 1,
  // offset = 0,
}) => {
  //page - 1* limit to get current offset i.e page 1 = 0 * 10 = offset of 0
  const offset = (page - 1) * limit;
  // ST_DistanceSphere to calculate distance from target coordinates - return will be in meters
  return prisma.$queryRaw`SELECT b.id, b."name", b.average_stars, b.review_count, b.address, b.city, b.postal_code, b.state, b.is_open, b.longitude, b.latitude,
                          ST_DistanceSphere(ST_MakePoint(${longitude}, ${latitude}), ST_ASText(location)::geometry)
                          AS distance_from_location
                          FROM businesses b
                          JOIN category_businesses cb ON b.id = cb.business_id
                          WHERE cb.category_id = ${category_id}
                          ORDER BY distance_from_location ASC
                          LIMIT ${limit} OFFSET ${offset}`;
};

// get all businesses of a name by location - will be used for showing
// a listing of multiple businesses with same name (also including special postfixes that are assumed to match base name)
const getBusinessesByNameFromLocation = ({
  business_name,
  longitude,
  latitude,
  limit = 10,
  page = 1,
}) => {
  const offset = (page - 1) * limit;
  // ST_DistanceSphere to calculate distance from target coordinates - return will be in meters
  return prisma.$queryRaw`SELECT b.id, b."name", b.average_stars, b.review_count, b.address, b.city, b.postal_code, b.state, b.is_open, b.longitude, b.latitude,
                          ST_DistanceSphere(ST_MakePoint(${longitude}, ${latitude}), ST_ASText(location)::geometry)
                          AS distance_from_location
                          FROM businesses b
                          WHERE unaccent("name") ILIKE ${`${business_name}%`}
                          ORDER BY distance_from_location ASC
                          LIMIT ${limit} OFFSET ${offset}; `;
};

// return total count of businesses in category query for pagination
const countBusinessesinCategory = ({ category_id }) => {
  return prisma.$queryRaw`SELECT COUNT(b.id) 
                          FROM businesses b
                          JOIN category_businesses cb ON b.id = cb.business_id
                          WHERE cb.category_id = ${category_id}`;
};

// return total count of businesses in name query for pagination
const countBusinessesByName = ({ business_name }) => {
  return prisma.$queryRaw`SELECT COUNT(b.id) 
                          FROM businesses b
                          WHERE unaccent (name) ILIKE ${`${business_name}%`}`;
};

// Use this for the filter by highest review count!
// ADD ANOTHER FOR FILTER BY AVERAGE STARS FOR BEST BUSINESSES
//     YOU WOULD HAVE TO CHANGE BUSINESSES BACK TO ROUDNED TO NEAREST HALF FOR AVERAGES STARS IN DB FOR THIS TO BE EFFECTIVE
const getBusinessesByCategory = ({ category_id, limit = 10, offset = 0 }) => {
  return prisma.$queryRaw`SELECT b.id, b."name", b.average_stars, b.review_count, b.address, b.city, b.postal_code, b.state, b.is_open, b.longitude, b.latitude
                            FROM businesses b
                            JOIN category_businesses cb ON b.id = cb.business_id
                            WHERE cb.category_id = ${category_id}
                            ORDER BY review_count DESC
                            LIMIT ${limit} OFFSET ${offset};
                            `;
};

const getHoursForBusiness = (business_id) => {
  return prisma.$queryRaw`SELECT day_of_week, close_time, open_time from business_hours
                          WHERE business_id = ${business_id}`;
};

const getPhotosForBusiness = ({ business_id, limit = 10000 }) => {
  return prisma.$queryRaw`SELECT id, caption, label FROM business_photos
                          WHERE business_id = ${business_id}
                          LIMIT ${limit}`;
};

// return locations filtered with user search query
const getCityStateFromBusinesses = ({ location, limit = 5 }) => {
  // if location includes a state
  if (location?.indexOf(",") > 0) {
    const city = location.slice(0, location.indexOf(","));

    const state = location.slice(location.indexOf(",") + 1).trim();

    // Query with fuzzy matching using pg_trgm
    return prisma.$queryRaw`SELECT DISTINCT city, state, COUNT(id) as business_count FROM businesses
                            WHERE (city % ${city} OR city ILIKE ${`%${city}%`}) 
                            AND (state % ${state} OR state ILIKE ${`%${state}%`})
                            GROUP BY city, state
                            ORDER BY business_count DESC
                            LIMIT ${limit}`;
  } else {
    // on input that does not yet include a state
    return prisma.$queryRaw`SELECT DISTINCT city, state, COUNT(id) as business_count FROM businesses
                            WHERE (city % ${location} OR city ILIKE ${`%${location}%`})
                            GROUP BY city, state
                            ORDER  BY business_count DESC
                            LIMIT ${limit}`;
  }
};

// for search, match businesses by start of name - only if user has typed more than 2 letters
// ILIKE for case insensitive search
// sort by closest to location if available to better match results??
// capable of returning multiple businesses with same name
const getBusinessesByName = ({ query, limit = 3 }) => {
  if (query.length < 2) return [];

  return prisma.$queryRaw`SELECT id, "name", average_stars, review_count, address, city, state,
                          COUNT(*) OVER (PARTITION BY unaccent("name")) AS duplicate_count -- count of names that match
                          FROM businesses
                          WHERE unaccent("name") % unaccent(${query})
                          OR unaccent("name") ILIKE ${`${query}%`}
                          ORDER BY similarity(unaccent("name"), unaccent(${query})) DESC -- Sorting by similarity
                          LIMIT ${limit};`;
};

// from end point, db query will receive a businesses Id as well as an updated average_stars and/or review_count on review functions
const updateBusiness = (id, data) => {
  return prisma.businesses.update({
    where: { id },
    data,
  });
};

module.exports = {
  countBusinessesByName,
  countBusinessesinCategory,
  getBusinessesByCategory,
  getBusinessesByCategoryFromLocation,
  getBusinessById,
  getBusinessesByName,
  getBusinessesByNameFromLocation,
  getBusinessesFromLocation,
  getCityStateFromBusinesses,
  getHoursForBusiness,
  getPhotosForBusiness,
  updateBusiness,
};
