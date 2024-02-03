"use strict";

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const UploadService = require("../services/upload.service");

class UploadController {
  uploadImageFromUrl = async (req, res, next) => {
    new SuccessResponse({
      message: "Upload image from url successfully!",
      metadata: await UploadService.uploadImageFromUrl(),
    }).send(res);
  };

  uploadFileThumb = async (req, res, next) => {
    const { file } = req;
    if (!file) throw new BadRequestError("File is required!");
    new SuccessResponse({
      message: "Upload image from url successfully!",
      metadata: await UploadService.uploadImageFromLocal({
        path: file.path,
      }),
    }).send(res);
  };

  uploadImageFromLocalS3 = async (req, res, next) => {
    const { file } = req;
    if (!file) throw new BadRequestError("File is required!");
    new SuccessResponse({
      message: "Upload image from local S3 successfully!",
      metadata: await UploadService.uploadImageFromLocalS3({
        file,
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
