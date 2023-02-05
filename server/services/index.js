"use strict";

const metadata = require("./metadata");
const chainWallet = require('./wallet');
const chainContract = require('./contract');
const { TYPE_NETWORK, TYPE_TOKEN } = require("../consts");
const { createCoreService } = require("@strapi/strapi").factories;

module.exports = {
  "chain-metadata": metadata,
  "chain-network": createCoreService(TYPE_NETWORK),
  "chain-wallet": chainWallet,
  "chain-token": createCoreService(TYPE_TOKEN),
  "chain-contract": chainContract,
};
