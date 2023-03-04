const { TYPE_CONTRACT } = require("../consts");

async function importTokens(ctx) {
  try {
    const zipFile = ctx.request.files.zipFile;
    const { contract } = ctx.params;
    const service = strapi.service(TYPE_CONTRACT);

    const result = await service.importTokens(contract, zipFile);

    ctx.body = result;
  } catch (error) {
    ctx.body = error;
    ctx.response.status = 500;
    strapi.log.error(error);
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
    const service = strapi.service(TYPE_CONTRACT);
    var result = await service.syncWallets();
    console.timeEnd("updateTokens");
    ctx.body = "Testing: " + JSON.stringify(result);
  } catch (err) {
    ctx.body = err;
    ctx.response.status = 500;
    console.log(err);
  }
}

// module.exports = {
//   importTokens,
//   updateTokens,
// };

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(TYPE_CONTRACT, ({ strapi }) => ({
  importTokens,
  updateTokens,
}));
