const _ = require("lodash");

function findChanges(obj1, obj2, basePath = "") {
  let changes = [];

  // Ensure both inputs are objects
  if (!_.isObject(obj1) || !_.isObject(obj2)) {
    return basePath ? [basePath] : [];
  }

  // Combine keys from both objects
  const allKeys = _.union(_.keys(obj1), _.keys(obj2));

  // Iterate over all keys
  allKeys.forEach((key) => {
    const newPath = basePath ? `${basePath}.${key}` : key;

    // If both values are objects, recurse deeper
    if (
      _.isObject(obj1[key]) &&
      _.isObject(obj2[key]) &&
      !_.isArray(obj1[key]) &&
      !_.isArray(obj2[key])
    ) {
      changes = changes.concat(findChanges(obj1[key], obj2[key], newPath));
    } else {
      // Check for differences
      if (!_.isEqual(obj1[key], obj2[key])) {
        changes.push(newPath);
      }
    }
  });

  return changes;
}

function checkObjects(currentObj, oldObj) {
  const changes = findChanges(currentObj, oldObj);
  return changes.length > 0
    ? { result: "VALUE_CHANGE", changes: changes }
    : { result: "NO_CHANGE" };
}

// Example usage:
const currentObj = {
  planCode: "CODE1",
  campaignCode: "code2",
  frontendLabel: "",
  rules: [
    {
      key: "paymentFrequency",
      value: "MONTHLY",
    },
    {
      key: "gender",
      value: "male",
    },
  ],
  frontendLabelLang: {
    en: "en title",
    my: "my title",
  },
  descriptionLang: {
    en: "en desc",
    my: "my desc",
  },
  discount: [
    {
      type: "percentage",
      value: 15,
    },
    {
      type: "amount",
      value: 100,
    },
  ],
};

const oldObj = {
  planCode: "CODE2",
  campaignCode: "code2",
  frontendLabel: "",
  rules: [
    {
      key: "paymentFrequency",
      value: "ANNUAL",
    },
    {
      key: "gender",
      value: "female",
    },
  ],
  frontendLabelLang: {
    en: "en",
    my: "my",
  },
  descriptionLang: {
    en: "en",
    my: "my",
  },
  discount: [
    {
      type: "percentage",
      value: 10,
    },
    {
      type: "amount",
      value: 200,
    },
  ],
};

console.log(checkObjects(currentObj, oldObj));
