"use strict";

const cloudinary = require("../configs/cloudinary.config");

class UploadService {
  static async uploadImageFromUrl() {
    console.log("test");
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
}

module.exports = UploadService;
