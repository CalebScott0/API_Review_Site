// photos from aws S3
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const express = require("express");
const business_router = express.Router();
const {
  getBusinessesFromLocation,
  getBusinessesByCategory,
  getBusinessesByCategoryFromLocation,
  getBusinessById,
  getHoursForBusiness,
  getPhotosForBusiness,
  getCityStateFromBusinesses,
} = require("../db/businesses");
const { getCategoriesForBusiness } = require("../db/categories");
const { getReviewsForBusiness } = require("../db/reviews");
const { roundHalf } = require("../db/utils");
const fetch = require("node-fetch");
require("dotenv").config();

// new s3 client
const s3Client = new S3Client({
  region: process.env.AWS_region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// generate signed url for photo access from s3 bucket
const generateSignedUrl = async (id) => {
  try {
    // add .jpg to key for images from s3 bucket
    let key = `${id}.jpg`;
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    });
    //60 second url expiration
    const signed_url = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    }); // URL expires in 1 hr
    return signed_url;
  } catch (error) {
    throw error;
  }
};

// GET api/businesses/locations?query="" - returns unique combinations of city and state from db
business_router.get("/locations", async (req, res, next) => {
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
// business_router.get("/nearby", async (req, res, next) => {
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
business_router.get("/categories/:category_id", async (req, res, next) => {
  const { category_id } = req.params;
  const { city, state, limit, offset } = req.query;
  // if no location provided. i.e general category search
  if (!city && !state) {
    try {
      // return ordered by review_count desc
      const fetch_businesses = await getBusinessesByCategory({
        category_id,
        limit: +limit,
        offset: +offset,
      });
      const businesses = await Promise.all(
        // Get most recent review for business (review db query limits to 1 on default and ordered by created_at)
        // get categories for business
        fetch_businesses.map(async (business) => {
          // let [business_hours, categories] = await Promise.all([
          let [hours, categories, photos, reviews] = await Promise.all([
            getHoursForBusiness(business.id),
            getCategoriesForBusiness(business.id),
            getPhotosForBusiness(business.id),
            getReviewsForBusiness({ business_id: business.id }),
          ]);
          // map photos with signed url from aws
          photos = await Promise.all(
            photos.map(async (photo) => {
              // destructure fields of photo
              const { id, caption, label } = photo;
              // generate signed url with key - id
              const signed_url = await generateSignedUrl(id);
              return {
                signed_url,
                caption,
                label,
              };
            })
          );
          return {
            ...business,
            // round average stars to nearest half before sending response
            average_stars: roundHalf(business.average_stars),
            hours,
            categories,
            photos,
            recent_review: reviews[0],
          };
        })
      );
      res.send({ businesses });
    } catch (error) {
      next({
        name: "BusinessByCategoryFetchError",
        message:
          "Unable to find businesses by category, check category id is valid",
      });
    }
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
      // pass longitude and latitude from location iq to get list of businesses ordered by
      // distance from target coordinates
      const fetch_businesses = await getBusinessesByCategoryFromLocation({
        category_id,
        limit: +limit,
        offset: +offset,
        longitude: +json[0].lon,
        latitude: +json[0].lat,
      });

      const businesses = await Promise.all(
        // Get most recent review for business (review db query limits to 1 on default and ordered by created_at)
        // get categories / hours for business
        fetch_businesses.map(async (business) => {
          let [hours, categories, reviews] = await Promise.all([
            getHoursForBusiness(business.id),
            getCategoriesForBusiness(business.id),
            getReviewsForBusiness({ business_id: business.id }),
            // let [hours, categories, photos, reviews] = await Promise.all([
            //   getHoursForBusiness(business.id),
            //   getCategoriesForBusiness(business.id),
            //   getPhotosForBusiness(business.id),
            //   getReviewsForBusiness({ business_id: business.id }),
          ]);
          // map photos with signed url from aws
          // photos = await Promise.all(
          //   photos.map(async (photo) => {
          //     // destructure fields of photo
          //     const { id, caption, label } = photo;
          //     // generate signed url with key - id
          //     const signed_url = await generateSignedUrl(id);
          //     return {
          //       signed_url,
          //       caption,
          //       label,
          //     };
          //   })
          // );
          return {
            ...business,
            // round average stars to nearest half before sending response
            average_stars: roundHalf(business.average_stars),
            hours,
            categories,
            // photos,
            recent_review: reviews[0],
          };
        })
      );

      res.send({ businesses });
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
business_router.get("/:business_id/reviews", async (req, res, next) => {
  const { business_id } = req.params;
  const { limit, offset } = req.query;
  try {
    const reviews = await getReviewsForBusiness({
      business_id,
      // parse to int as they will be string from req
      limit: +limit,
      offset: +offset,
    });

    res.send({ reviews });
  } catch (error) {
    next({
      name: "ReviewFetchError",
      message: "Unable to fetch reviews for business",
    });
  }
});

// GET api/businesses/:business_id/photos
business_router.get("/:business_id/photos", async (req, res, next) => {
  const { business_id } = req.params;
  try {
    const photos = await getPhotosForBusiness(business_id);

    res.send({ photos });
  } catch (error) {
    next({
      name: "PhotoFetchError",
      message: "Unable to fetch photos for business",
    });
  }
});

// GET /api/businesses/:business_id
business_router.get("/:business_id", async (req, res, next) => {
  try {
    const { business_id } = req.params;
    let [business, hours, categories, photos] = await Promise.all([
      getBusinessById(business_id),
      getHoursForBusiness(business_id),
      getCategoriesForBusiness(business_id),
      getPhotosForBusiness(business_id),
    ]);
    // map photos with signed url from aws
    photos = await Promise.all(
      photos.map(async (photo) => {
        // destructure fields of photo
        const { id, caption, label } = photo;
        // generate signed url with key - id
        const signed_url = await generateSignedUrl(id);
        return {
          signed_url,
          caption,
          label,
        };
      })
    );
    if (categories.length) {
      business = {
        ...business[0],
        // round average stars to nearest half before sending response
        average_stars: roundHalf(business[0].average_stars),
        hours,
        categories,
        photos,
      };
      // throws error in endpoint
    } else {
      throw new Error();
    }
    res.send({ business });
  } catch (error) {
    next({
      name: "BusinessFetchError",
      message: "Unable to find Business, check id is valid",
    });
  }
});

module.exports = business_router;
