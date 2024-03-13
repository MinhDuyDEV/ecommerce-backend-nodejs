"use strict";

const { AuthFailureError } = require("../core/error.response");
const { roleList } = require("../services/rbac.service");
const rbac = require("./role.middleware");

/**
 * @param {string} action // read:any, read:own, update:any, update:own, delete:any, delete:own
 * @param {*} resource profile, product, discount, cart, inventory, comment, notification, upload
 */
const grantAccess = (action, resource) => {
  console.log("🚀 ~ grantAccess ~ action:", action);
  console.log("🚀 ~ grantAccess ~ resource:", resource);
  return async (req, res, next) => {
    try {
      rbac.setGrants(await roleList({ userId: 9999 }));
      const role_name = req.query.role;
      const permission = rbac.can(role_name)[action](resource);
      if (!permission.granted) {
        throw new AuthFailureError("Permission denied");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { grantAccess };
