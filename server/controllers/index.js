"use strict";

const { TYPE_TOKEN, TYPE_CONTRACT, TYPE_WALLET } = require("../consts");
const metadata = require("./metadata");
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = {
  "chain-metadata": metadata,
  "chain-token": createCoreController(TYPE_TOKEN),
  "chain-contract": createCoreController(TYPE_CONTRACT),
  "chain-wallet": createCoreController(TYPE_WALLET),
};
