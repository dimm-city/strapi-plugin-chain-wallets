"use strict";

const chainToken = require("./token");
const chainWallet = require('./wallet');
const chainContract = require('./contract');
const { TYPE_NETWORK } = require("../consts");
const { createCoreService } = require("@strapi/strapi").factories;

module.exports = {
  "chain-network": createCoreService(TYPE_NETWORK),
  "chain-wallet": chainWallet,
  "chain-token": chainToken,
  "chain-contract": chainContract,
};
