const planCampaignCodeRulesParams = {
  planCode: "CODE1",
  paymentFrequency: "ALL",
  gender: "male",
};

const planCampaignCodeRules = [
  {
    planCode: "CODE1",
    rules: [
      {
        key: "paymentFrequency",
        value: "ALL",
      },
      {
        key: "gender",
        value: "male",
      },
    ],
  },
  {
    planCode: "CODE2",
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
  },
];

function findMatchingCampaignRules(params, campaignRules) {
  let matches = []; // Initialize an empty array to store matches

  // Iterate over each campaignRule
  campaignRules.forEach((campaignRule) => {
    if (params.planCode === campaignRule.planCode) {
      // Check if planCode matches
      let isMatch = true; // Initialize as true, we assume it matches until proven otherwise

      // Iterate over the rules in the campaignRule
      campaignRule.rules.forEach((rule) => {
        if (params[rule.key] !== rule.value) {
          // If any rule does not match, set isMatch to false
          isMatch = false;
        }
      });

      // If all rules match, push the campaignRule object onto the matches array
      if (isMatch) {
        matches.push(campaignRule);
      }
    }
  });

  // Return the array of matching campaign rules
  return matches;
}

const matchingCampaigns = findMatchingCampaignRules(
  planCampaignCodeRulesParams,
  planCampaignCodeRules
);
console.log(matchingCampaigns);
