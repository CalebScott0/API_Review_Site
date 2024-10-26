// photos from aws S3
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

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
    const signed_url = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    }); // URL expires in 1 hr
    return signed_url;
  } catch (error) {
    throw error;
  }
};

export default generateSignedUrl;
