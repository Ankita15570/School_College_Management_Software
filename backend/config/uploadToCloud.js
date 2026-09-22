const AWS = require("aws-sdk");
const logger = require("./logger");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  region: process.env.AWS_S3_REGION,
});

const uploadToCloud = async (file, folder = "uploads") => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${folder}/${Date.now()}_${file.name}`,
      Body: file.data,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    const result = await s3.upload(params).promise();
    logger.info(`File uploaded to S3: ${result.Location}`);
    return result.Location;
  } catch (err) {
    logger.error(`S3 upload error: ${err.message}`);
    throw new Error("Failed to upload file to S3");
  }
};

module.exports = {uploadToCloud};