"use strict";

const cloudinary = require("../configs/cloudinary.config");
const {
  s3,
  PutObjectCommand,
  GetObjectCommand,
  DeleteBucketCommand,
} = require("../configs/s3.config");
const crypto = require("crypto");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

class UploadService {
  static async uploadImageFromUrl() {
    try {
      const urlImage =
        "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-li7ko2rtlkgic2";
      const folderName = "product/2201";
      const newFileName = "testDemo";
      const result = await cloudinary.uploader.upload(urlImage, {
        public_id: newFileName,
        folder: folderName,
      });
      return result;
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  static async uploadImageFromLocal({ path, folderName = "product/2201" }) {
    try {
      const result = await cloudinary.uploader.upload(path, {
        public_id: "thumb",
        folder: folderName,
      });
      return {
        image_url: result.secure_url,
        shopId: 2201,
        thumb_url: await cloudinary.url(result.public_id, {
          height: 100,
          width: 100,
          format: "jpg",
        }),
      };
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  // Upload file to S3
  static async uploadImageFromLocalS3({ file }) {
    try {
      const randomImageName = crypto.randomBytes(16).toString("hex");
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: randomImageName,
        Body: file.buffer,
        ContentType: "image/jpeg",
      });
      // export url
      const result = await s3.send(command);
      console.log(
        "🚀 ~ UploadService ~ uploadImageFromLocalS3 ~ result:",
        result
      );
      const singedUrl = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: randomImageName,
      });
      console.log("singedUrl", singedUrl);
      const url = await getSignedUrl(s3, singedUrl, { expiresIn: 3600 });
      console.log("🚀 ~ UploadService ~ uploadImageFromLocalS3 ~ url:", url);
      return url;
    } catch (error) {
      console.log("Error: ", error);
    }
  }
}

module.exports = UploadService;
