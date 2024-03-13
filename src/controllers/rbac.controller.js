"use strict";

const { SuccessResponse } = require("../core/success.response");
const RBACService = require("../services/rbac.service");

/**
 * @description Create new role
 * @param {String} name
 * @param {String} slug
 * @param {String} description
 * @param {Array} grants
 */
const newRole = async (req, res, next) => {
  new SuccessResponse({
    message: "Created role",
    metadata: await RBACService.createRole(req.body),
  }).send(res);
};

/**
 * @description Create new resource
 * @param {String} name
 * @param {String} slug
 * @param {String} description
 */
const newResource = async (req, res, next) => {
  new SuccessResponse({
    message: "Created resource",
    metadata: await RBACService.createResource(req.body),
  }).send(res);
};

/**
 * @description Get list role
 * @param {Number} userId
 * @param {Number} limit
 * @param {Number} offset
 * @param {String} search
 */
const listRole = async (req, res, next) => {
  new SuccessResponse({
    message: "List role",
    metadata: await RBACService.roleList(req.query),
  }).send(res);
};

/**
 * @description Get list resource
 * @param {Number} userId
 * @param {Number} limit
 * @param {Number} offset
 * @param {String} search
 */
const listResource = async (req, res, next) => {
  new SuccessResponse({
    message: "List resource",
    metadata: await RBACService.resourceList(req.query),
  }).send(res);
};

module.exports = { newRole, newResource, listRole, listResource };
