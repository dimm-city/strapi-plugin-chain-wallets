"use strict";

const { TYPE_WALLET } = require("../consts");
const token = require("./token");
const contract = require("./contract");
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = {
  "chain-token": token,
  "chain-contract": contract,
  "chain-wallet": createCoreController(TYPE_WALLET),
};
