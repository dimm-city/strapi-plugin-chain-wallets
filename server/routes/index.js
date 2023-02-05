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
        method: "GET",
        path: "/import-tokens/:contract",
        handler: "chain-contract.importTokens",
        config: {
          policies: [],
        },
      },
      {
        method: "GET",
        path: "/metadata/:contract/:tokenId",
        handler: "chain-metadata.getTokenMetadata",
        config: {
          policies: ["token-exists"],
        },
      },
      {
        method: "GET",
        path: "/images/:contract/:tokenId.png",
        handler: "chain-metadata.getTokenMetadata",
        config: {
          policies: ["token-exists"],
        },
      },
    ],
  },
};
