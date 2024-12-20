const express = require("express");

const businesses_router = express.Router();

const {
  countBusinessesByName,
  countBusinessesinCategory,
  // getBusinessesFromLocation,
  getBusinessesByCategory,
  getBusinessesByCategoryFromLocation,
  getBusinessById,
  getBusinessesByNameFromLocation,
  getBusinessRatingDistribution,
  getHoursForBusiness,
  getPhotosForBusiness,
  getCityStateFromBusinesses,
} = require("../db/businesses");

const { getCategoriesForBusiness } = require("../db/categories");

const { getReviewsForBusiness } = require("../db/reviews");

const { metersToMiles } = require("../db/utils");

const generateSignedUrl = require("./__utils__/business_utils");

const fetch = require("node-fetch");

require("dotenv").config();

// GET api/businesses/locations?query="" - returns unique combinations of city and state from db
businesses_router.get("/locations", async (req, res, next) => {
  try {
    const { location } = req.query;

    // matches with Ilike sql query
    let locations = await getCityStateFromBusinesses({ location });

    // remove big int count
    locations = locations.map(({ city, state }) => ({
      city,
      state,
    }));

    // CREATE MAP FOR CITY AND CLEAN CITY NAME

    res.send({ locations });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// function can take latitude, longitude, and a radius
// has a default in db query
// GET api/businesses/nearby?city=""&state=""limit={&offset={}
// businesses_router.get("/nearby", async (req, res, next) => {
//   try {
//     // get city, state from req query and use location iq api
//     const { city, state, limit, offset } = req.query;

//     // make call to location iq api with req query city and state, returns 1
//     const url = `https://us1.locationiq.com/v1/search/structured?city=${city}&state=${state}&format=json&limit=1&key=${process.env.LOCATION_API_KEY}`;

//     const options = { method: "GET", headers: { accept: "application/json" } };

//     // use node fetch to call location iq api
//     const location_response = await fetch(url, options);

//     const json = await location_response.json();

//     // pass longitude and latitude from location iq to get all businesses from location function
//     // default radius parameter of 10miles converted to kilometers
//     const fetch_businesses = await getBusinessesFromLocation({
//       limit: +limit,
//       offset: +offset,
//       longitude: +json[0].lon,
//       latitude: +json[0].lat,
//     });

//     const businesses = await Promise.all(
//       // Get most recent review for business (review db query limits to 1 on default and ordered by created_at)
//       // get categories / hours for business
//       fetch_businesses.map(async (business) => {
//         let [review, business_hours, categories] = await Promise.all([
//           getReviewsForBusiness({ business_id: business.id }),
//           getHoursForBusiness(business.id),
//           getCategoriesForBusiness(business.id),
//         ]);

//         return {
//           ...business,
//           hours: business_hours,
//           categories,
//           recent_review: review[0],
//         };

//       })
//     );

//     res.send({ businesses });

//   } catch ({ name, message }) {
//     next({ name, message });

//   }
// });

// Get a list of businesses with a given category_id
// options to add city and state query filters - return will be ordered by distance
// from location

// GET /api/businesses/categories/:category_id?city=""&state=""&limit={}&offset={}
businesses_router.get("/categories/:category_id", async (req, res, next) => {
  const { category_id } = req.params;

  const { city, state, limit, page } = req.query;
  // const { city, state, limit, offset } = req.query;

  // if no location provided
  if (!city && !state) {
    // make this return for now, decide later if you want to handle search with no categories
    return;
    // try {
    //   // return ordered by review_count desc
    //   const fetch_businesses = await getBusinessesByCategory({
    //     category_id,
    //     limit: +limit,
    //     offset: +offset,
    //   });

    //   const businesses = await Promise.all(
    //     // Get most recent review for business (review db query limits to 1 on default and ordered by created_at)
    //     // get categories for business
    //     fetch_businesses.map(async (business) => {
    //       // let [business_hours, categories] = await Promise.all([
    //       let [hours, categories, reviews] = await Promise.all([
    //         getHoursForBusiness(business.id),
    //         getCategoriesForBusiness(business.id),
    //         getReviewsForBusiness({ business_id: business.id }),
    //       ]);
    //       return {
    //         ...business,
    //         // round average stars to tenth before sending response
    //         average_stars: +business.average_stars.toFixed(1),
    //         // convert meters to miles for distance from target
    //         distance_from_location: metersToMiles(),
    //         hours,
    //         categories,
    //         recent_review: reviews[0],
    //       };
    //     })
    //   );

    //   res.send({ businesses });
    // } catch (error) {
    //   next({
    //     name: "BusinessByCategoryFetchError",
    //     message:
    //       "Unable to find businesses by category, check category id is valid",
    //   });
    // }
  } else if (city && state) {
    try {
      // make call to location iq api with req query's city and state, returns 1
      const url = `https://us1.locationiq.com/v1/search/structured?city=${city}&state=${state}&format=json&limit=1&key=${process.env.LOCATION_API_KEY}`;

      const options = {
        method: "GET",
        headers: { accept: "application/json" },
      };

      // use node fetch to call location iq api
      const location_response = await fetch(url, options);

      const json = await location_response.json();

      /* pass longitude and latitude from location iq to get list of businesses ordered by
       * distance from target coordinates
       * also grab total count of businesses in category for pagination
       */
      const [fetch_businesses, total] = await Promise.all([
        getBusinessesByCategoryFromLocation({
          category_id,
          limit: +limit,
          page: +page,
          // offset: +offset,
          longitude: +json[0]?.lon,
          latitude: +json[0]?.lat,
        }),
        countBusinessesinCategory({
          category_id,
        }),
      ]);

      // convert count businesses to number from bigInt
      const count_businesses = Number(total[0].count);

      // Uncomment this if not sorted after sql

      // fetch_businesses.sort((a, b) =>
      //   a.distance_from_location > b.distance_from_location ? 1 : -1
      // );

      const businesses = await Promise.all(
        // Get most recent review for business (review db query limits to 1 on default and ordered by created_at)
        // get categories / hours for business
        fetch_businesses.map(async (business) => {
          let [hours, categories, reviews] = await Promise.all([
            getHoursForBusiness(business.id),
            getCategoriesForBusiness(business.id),
            getReviewsForBusiness({ business_id: business.id }),
          ]);
          return {
            // return search location coordinates to use as center on map

            ...business,
            // round average stars to tenth before sending response
            average_stars: +business.average_stars.toFixed(1),
            // convert meters to miles for distance from target
            distance_from_location: metersToMiles(
              business.distance_from_location
            ),
            hours,
            categories,
            recent_review: reviews[0],
          };
        })
      );

      // in response - send total count of businesses in category, current page, total pages, and list of 10 businesses
      res.send({
        count_businesses,
        page: +page,
        pages: Math.ceil(count_businesses / limit),
        businesses,
      });
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    // if only one city or state was provided in query
    next({
      name: "BusinessByCategoryFetchError",
      message: "Please provide both city and state for a location search",
    });
  }
});

// GET /api/businesses/name/:business_name
businesses_router.get("/name/:business_name", async (req, res, next) => {
  const { business_name } = req.params;

  const { city, state, limit, page } = req.query;

  if (!city && !state) {
    // make this return for now, decide later if you want to handle search with no categories
    return;
    // try {
    //   // return ordered by review_count desc
    //   const fetch_businesses = await getBusinessesByCategory({
    //     category_id,
    //     limit: +limit,
    //     offset: +offset,
    //   });

    //   const businesses = await Promise.all(
    //     // Get most recent review for business (review db query limits to 1 on default and ordered by created_at)
    //     // get categories for business
    //     fetch_businesses.map(async (business) => {
    //       // let [business_hours, categories] = await Promise.all([
    //       let [hours, categories, reviews] = await Promise.all([
    //         getHoursForBusiness(business.id),
    //         getCategoriesForBusiness(business.id),
    //         getReviewsForBusiness({ business_id: business.id }),
    //       ]);
    //       return {
    //         ...business,
    //         // round average stars to tenth before sending response
    //         average_stars: +business.average_stars.toFixed(1),
    //         // convert meters to miles for distance from target
    //         distance_from_location: metersToMiles(),
    //         hours,
    //         categories,
    //         recent_review: reviews[0],
    //       };
    //     })
    //   );

    //   res.send({ businesses });
    // } catch (error) {
    //   next({
    //     name: "BusinessByCategoryFetchError",
    //     message:
    //       "Unable to find businesses by category, check category id is valid",
    //   });
    // }
  } else if (city && state) {
    try {
      // make call to location iq api with req query's city and state, returns 1
      const url = `https://us1.locationiq.com/v1/search/structured?city=${city}&state=${state}&format=json&limit=1&key=${process.env.LOCATION_API_KEY}`;

      const options = {
        method: "GET",
        headers: { accept: "application/json" },
      };

      // use node fetch to call location iq api
      const location_response = await fetch(url, options);

      const json = await location_response.json();

      /* pass longitude and latitude from location iq to get list of businesses ordered by
       * distance from target coordinates
       * also grab total count of businesses with name for pagination
       */
      const [fetch_businesses, total] = await Promise.all([
        getBusinessesByNameFromLocation({
          business_name,
          limit: +limit,
          page: +page,
          longitude: +json[0]?.lon,
          latitude: +json[0]?.lat,
        }),
        countBusinessesByName({
          business_name,
        }),
      ]);

      // convert count businesses to number from bigInt
      const count_businesses = Number(total[0].count);

      // Uncomment this if not sorted after sql

      // fetch_businesses.sort((a, b) =>
      //   a.distance_from_location > b.distance_from_location ? 1 : -1
      // );

      const businesses = await Promise.all(
        // Get most recent review for business (review db query limits to 1 on default and ordered by created_at)
        // get categories / hours for business
        fetch_businesses.map(async (business) => {
          let [hours, categories, reviews] = await Promise.all([
            getHoursForBusiness(business.id),
            getCategoriesForBusiness(business.id),
            getReviewsForBusiness({ business_id: business.id }),
          ]);
          return {
            // return search location coordinates to use as center on map

            ...business,
            // round average stars to tenth before sending response
            average_stars: +business.average_stars.toFixed(1),
            // convert meters to miles for distance from target
            distance_from_location: metersToMiles(
              business.distance_from_location
            ),
            hours,
            categories,
            recent_review: reviews[0],
          };
        })
      );

      // in response - send total count of businesses in category, current page, total pages, and list of 10 businesses
      res.send({
        count_businesses,
        page: +page,
        pages: Math.ceil(count_businesses / limit),
        businesses,
      });
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    // if only one city or state was provided in query
    next({
      name: "BusinessByCategoryFetchError",
      message: "Please provide both city and state for a location search",
    });
  }
});

// GET api/businesses/:business_id/reviews?limit={}&offset={}
businesses_router.get("/:business_id/reviews", async (req, res, next) => {
  const { business_id } = req.params;

  const { limit, page } = req.query;

  try {
    // grab reivews and total reviewCount from business for pagination
    const [reviews, business] = await Promise.all([
      // getBusinessRatingDistribution(business_id),
      getReviewsForBusiness({
        business_id,
        // parse to int as they will be string from req
        limit: +limit,
        page: +page,
      }),
      getBusinessById(business_id),
    ]);
    const review_count = business[0].review_count;

    res.send({
      review_count,
      page: +page,
      pages: Math.ceil(review_count / limit),
      reviews,
    });
  } catch (error) {
    next({
      name: "ReviewFetchError",
      message: "Unable to fetch reviews for business",
    });
  }
});

// GET api/businesses/:business_id/photos
businesses_router.get("/:business_id/photos", async (req, res, next) => {
  const { business_id } = req.params;
  const { limit } = req.query;
  try {
    let photos = await getPhotosForBusiness({ business_id, limit: +limit });

    // map photos with signed url from aws
    photos = await Promise.all(
      photos.map(async (photo) => {
        // destructure fields of photo
        const { id, caption, label } = photo;

        // generate signed url with key - id
        const signed_url = await generateSignedUrl(id);

        return {
          id,
          signed_url,
          caption,
          label,
        };
      })
    );

    res.send({ photos });
  } catch (error) {
    next({
      name: "PhotoFetchError",
      message: "Unable to fetch photos for business",
    });
  }
});

// GET /api/businesses/:business_id
businesses_router.get("/:business_id", async (req, res, next) => {
  try {
    const { business_id } = req.params;

    let [business, hours, categories] = await Promise.all([
      getBusinessById(business_id),
      getHoursForBusiness(business_id),
      getCategoriesForBusiness(business_id),
    ]);
    if (categories.length) {
      business = {
        ...business[0],
        // round average stars to tenth before sending response
        average_stars: +business[0].average_stars.toFixed(1),
        hours,
        // destructure categories to remove total_popularity
        categories,
      };

      // throws error in endpoint
    } else {
      throw new Error();
    }
    res.send({ business });
  } catch ({ name, message }) {
    next({
      name,
      message,
    });
  }
});

// BUSINESS RATING DISTRIBUTION ENDPOINT
// - START BREAKING UP OTHER FUNCTIONS IN BUSINESS ENDPOINTS
// - THAT ARE NOT FETCHING BUSINESSES? (LIKE REVIEWS/CATEGORIES?) - after mvp

// convert count values of rating distrubtion to int from bigInt
// rating_distribution.forEach((item) => {
//   item.count = Number(item.count);
// });

module.exports = businesses_router;
