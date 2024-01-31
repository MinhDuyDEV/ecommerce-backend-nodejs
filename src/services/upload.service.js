"use strict";

const cloudinary = require("../configs/cloudinary.config");

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
}

module.exports = UploadService;
