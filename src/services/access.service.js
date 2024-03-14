"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static handlerRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something went wrong!");
    }
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("Shop not registered");
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered");
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.privateKey,
      holderToken.publicKey
    );

    await holderToken.updateOne({
      $set: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      $addToSet: { refreshTokensUsed: refreshToken },
    });
    return {
      user: { userId, email },
      tokens,
    };
  };

  static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    let { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something went wrong! Please login again!");
    }
    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("Shop not registered!");
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered!");
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.privateKey,
      keyStore.publicKey
    );

    await keyStore.updateOne({
      $set: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      $addToSet: { refreshTokensUsed: refreshToken },
    });
    return {
      user,
      tokens,
    };
  };

  static logout = async (keyStore) => {
    return await KeyTokenService.removeTokenById(keyStore._id);
  };

  static login = async ({ email, password, refreshToken = null }) => {
    if (!email || !password)
      throw new BadRequestError("Email or password is missing!");
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered!");
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication error!");
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      privateKey,
      publicKey
    );
    await KeyTokenService.createKeyToken({
      userId,
      privateKey,
      publicKey,
      refreshToken: tokens.refreshToken,
    });
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered!");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      // create privateKey, publicKey
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      //save collection KeyStore
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        privateKey,
        publicKey,
      });
      if (!keyStore) {
        throw new BadRequestError("Error: KeyStore error!");
      }
      // created token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        privateKey,
        publicKey
      );
      console.log(`Created Token success::`, tokens);
      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
