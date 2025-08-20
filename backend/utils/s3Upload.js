import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, bucketName } from "./s3.js";

/**
 * Upload a file buffer to S3
 * @param {Object} file - Multer file object
 * @param {string} userId - user ID to namespace the file
 * @returns {string} - public URL of uploaded file
 */
export async function uploadToS3(file, userId) {
  if (!file) return "";

  const fileName = `/posts/${userId}/${Date.now()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read", 
  });

  await s3.send(command);

  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}
