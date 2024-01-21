"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");

const convertToObjectIdMongodb = (id) => new Types.ObjectId(id);

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedData = (object) => {
  Object.keys(object).forEach((key) => {
    if (object[key] && typeof object[key] === "object") {
      removeUndefinedData(object[key]);
    } else if (object[key] == null) {
      delete object[key];
    }
  });
  return object;
};

const updateNestedObjectParser = (object) => {
  const final = {};
  Object.keys(object || {}).forEach((key) => {
    if (typeof object[key] === "object" && !Array.isArray(object[key])) {
      const response = updateNestedObjectParser(object[key]);
      Object.keys(response || {}).forEach((nestedKey) => {
        final[`${key}.${nestedKey}`] = response[nestedKey];
      });
    } else {
      final[key] = object[key];
    }
  });
  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeUndefinedData,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
};
