const express = require("express");
// photos from aws S3
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

const photos_router = express.Router();

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

// GET /api/photos/business/:business_id
photos_router.get("/business/:business_id", async (req, res, next) => {
  const { business_id } = req.params;
  try {
    let photos = await getPhotosForBusiness(business_id);
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
    res.send({ photos });
  } catch (error) {
    next({
      name: "PhotoFetchError",
      message: "Unable to fetch photos for business",
    });
  }
});

module.exports = photos_router;
