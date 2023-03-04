const { TYPE_TOKEN } = require('../consts');
const { createCoreRouter } = require('@strapi/strapi').factories;

const tokenRouter = createCoreRouter(TYPE_TOKEN, {
  only: ['find'],
  config: {
    find: {
      auth: false,
      policies: [],
      middlewares: [],
    }
  }
});

module.exports = {
  "content-api": {
    type: "content-api",
    routes: [
      {
        method: "GET",
        path: "/test/:id",
        handler: "chain-token.findOne",
        config: {
          policies: ["owns-token"],
        },
      },
      {
        method: "GET",
        path: "/tokens",
        handler: "chain-token.find",
        config: {
          policies: [],
        },
      },
      {
        method: "GET",
        path: "/tokens/:id",
        handler: "chain-token.findOne",
        config: {
          policies: [],
        },
      },
      {
        method: "GET",
        path: "/tokens/:id/owns",
        handler: "chain-token.ownsToken",
        config: {
          policies: [],
        },
      },
      {
        method: "GET",
        path: "/contracts",
        handler: "chain-contract.find",
        config: {
          policies: [],
        },
      },
      {
        method: "GET",
        path: "/contracts/:id",
        handler: "chain-contract.findOne",
        config: {
          policies: [],
        },
      },
      {
        method: "POST",
        path: "/wallets/attach/:network",
        handler: "chain-wallet.attachUserWallet",
        config: {
          policies: [],
        },
      },
      {
        method: "POST",
        path: "/wallets/detach/:network/:address",
        handler: "chain-wallet.detachUserWallet",
        config: {
          policies: [],
        },
      },
      {
        method: "GET",
        path: "/wallets",
        handler: "chain-wallet.getUserWallets",
        config: {
          policies: [],
        },
      },
      {
        method: "GET",
        path: "/wallets/verification-message",
        handler: "chain-wallet.getVerificationMessage",
        config: {
          policies: [],
        },
      },
      {
        method: "POST",
        path: "/import-tokens/:contract",
        handler: "chain-contract.importTokens",
        config: {
          policies: [],
        },
      },
      {
        method: "GET",
        path: "/metadata/:contract/:tokenId",
        handler: "chain-token.getTokenMetadata",
        config: {
          policies: ["token-exists"],
        },
      },
      {
        method: "GET",
        path: "/images/:contract/:tokenId.png",
        handler: "chain-token.getTokenImage",
        config: {
          policies: ["token-exists"],
        },
      },
    ],
  },
};
