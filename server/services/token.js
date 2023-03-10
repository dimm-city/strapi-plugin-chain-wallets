"use strict";
const { createCoreService } = require("@strapi/strapi").factories;
const { TYPE_TOKEN, NAME_META_EXTENDER } = require("../consts");

const path = require("path");
const fs = require("fs");

/**
 * metadata service
 */

module.exports = createCoreService(TYPE_TOKEN, ({ strapi }) => ({
  async getMetadata(contract, tokenId) {
    let result = { attributes: [] };

    const tokens = await super.find({
      filters: {
        tokenId: tokenId,
        contract: {
          slug: contract,
        },
      },
      populate: "*",
    });

    if (tokens?.results.length > 0) {
      const token = tokens.results.at(0);
      result = token?.metadata ?? result;

      const entitySvc = strapi.services[token.contract.entityType];

      if (entitySvc) {
        let entities = await entitySvc.find({
          filters: {
            token: {
              id: token.id,
            },
          },
        });

        let entity;
        if (entities?.results.length > 0) {
          entity = entities.results.at(0);
        }
        const extenderName =
          token.contract.metadataExtender ?? NAME_META_EXTENDER;

        if (entitySvc[extenderName] instanceof Function) {
          result = await entitySvc[extenderName](token, entity);
        }
      }
    } else {
      result = null;
    }
    return result;
  },
  async getImage(contract, tokenId) {
    const tokens = await super.find({
      filters: {
        tokenId: tokenId,
        contract: {
          slug: contract,
        },
      },
      populate: "*",
    });

    let token = {};
    if (tokens?.results.length > 0) {
      token = tokens.results.at(0);
    }

    const imagePathBase =
      strapi.plugin("chain-wallets").config("imagePath") ?? ".tokens";

    //ToDo allow for different image loader/strategy
    const imagePath = path.join(
      path.resolve("."),
      `${imagePathBase}/${token.contract.slug}/${token.tokenId}.png`
    );

    fs.stat(imagePath, function (err, stat) {
      if (err == null) {
        console.log("File exists");
        return fs.createReadStream(imagePath);
      } else if (err.code === "ENOENT") {
        // file does not exist
        console.log("file does not exist");
      } else {
        console.log("Some other error: ", err.code);
      }
    });

    return null;
  },
}));
