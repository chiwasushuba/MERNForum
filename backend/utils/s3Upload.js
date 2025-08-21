// utils/s3Upload.js

const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3, bucketName } = require("./s3");

/**
 * Upload a file buffer to S3
 * @param {Object} file - Multer file object
 * @param {string} userId - user ID to namespace the file
 * @returns {string} - public URL of uploaded file
 */
async function s3Upload(file, userId) {
  if (!file) return "";

  const fileName = `posts/${userId}/${Date.now()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL: "public-read", ❌ remove this since ACLs are disabled
  });

  await s3.send(command);

  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}

module.exports = { s3Upload };
