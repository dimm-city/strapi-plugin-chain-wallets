"use strict";

const { TYPE_TOKEN, TYPE_WALLET } = require("../consts");
const metadata = require("./metadata");
const contract = require("./contract");
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = {
  "chain-metadata": metadata,
  "chain-token": createCoreController(TYPE_TOKEN),
  "chain-contract": contract,
  "chain-wallet": createCoreController(TYPE_WALLET),
};
