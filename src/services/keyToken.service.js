"use strict";

const keyTokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    privateKey,
    publicKey,
    refreshToken,
  }) => {
    try {
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   privateKey,
      //   publicKey,
      // });
      // return tokens ? tokens.publicKey : null;

      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
