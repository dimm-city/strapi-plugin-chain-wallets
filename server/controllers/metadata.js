"use strict";

const { TYPE_METADATA } = require("../consts");

/**
 * A set of functions called "actions" for `metadata`
 */
async function getTokenMetadata(ctx, next) {
  const { tokenId, contract } = ctx.params;
  const service = strapi.service(TYPE_METADATA);
  let result = await service.mergeMetadata(tokenId, contract);
  if(result){
    ctx.body = result;
  } else {
    ctx.response.statusCode = 404;
  }
}

/**
 * Testing endpoint that should be removed
 * @param {*} ctx the request context
 * @param {*} next next function in request pipeline
 */
async function updateTokens(ctx, next) {
  try {
    console.time("updateTokens");
    const service = strapi.service(TYPE_METADATA);
    var result = await service.syncWallets();
    console.timeEnd("updateTokens");
    ctx.body = "Testing: " + JSON.stringify(result);
  } catch (err) {
    ctx.body = err;
    ctx.response.status = 500;
    console.log(err);
  }
}

module.exports = {
  updateTokens,
  getTokenMetadata,
};
