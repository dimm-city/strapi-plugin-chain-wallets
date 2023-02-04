const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "plugin::chain-wallets.chain-contract",
  ({ strapi }) => ({
    async importTokens(contract, tokens) {},
  })
);
