"use strict";

const Resource = require("../models/resource.model");
const Role = require("../models/role.model");

class RBACService {
  /**
   * @param {string} name
   * @param {string} slug
   * @param {string} description
   */
  static async createResource({ name, slug, description }) {
    try {
      // check name or slug exist
      // create resource
      const resource = await Resource.create({
        src_name: name,
        src_slug: slug,
        src_description: description,
      });
      return resource;
    } catch (error) {
      return error;
    }
  }

  static async resourceList({
    userId = 0, // admin
    limit = 30,
    offset = 0,
    search = "",
  }) {
    try {
      // check admin ? middleware function
      // find all resources
      const resource = await Resource.aggregate([
        {
          $project: {
            _id: 0,
            name: "$src_name",
            slug: "$src_slug",
            description: "$src_description",
            resourceId: "$_id",
            createdAt: 1,
          },
        },
      ]);
      return resource;
    } catch (error) {
      return [];
    }
  }
  static async createRole({
    name = "shop",
    slug = "s00001",
    description = "extend from shop or user",
    grants = [],
  }) {
    try {
      // check role exist
      // create role
      const role = await Role.create({
        role_name: name,
        role_slug: slug,
        role_description: description,
        role_grants: grants,
      });
      return role;
    } catch (error) {
      return error;
    }
  }
  static async roleList({
    userId = 999, // admin
    limit = 30,
    offset = 0,
    search = "",
  }) {
    try {
      const roles = await Role.aggregate([
        {
          $unwind: "$role_grants",
        },
        {
          $lookup: {
            from: "Resources",
            localField: "role_grants.resource",
            foreignField: "_id",
            as: "resource",
          },
        },
        {
          $unwind: "$resource",
        },
        {
          $project: {
            role: "$role_name",
            resource: "$resource.src_name",
            action: "$role_grants.actions",
            attributes: "$role_grants.attributes",
          },
        },
        {
          $unwind: "$action",
        },
        {
          $project: {
            _id: 0,
            role: 1,
            resource: 1,
            action: 1,
            attributes: 1,
          },
        },
      ]);
      return roles;
    } catch (error) {
      return error;
    }
  }
}

module.exports = RBACService;
