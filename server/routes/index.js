module.exports = {
  "content-api": {
    type: "content-api",
    routes: [
      {
        method: "GET",
        path: "/test",
        handler: "chain-contract.updateTokens",
        config: {
          policies: ["owns-token"],
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
        method: "GET",
        path: "/wallets/verficiation-message",
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
