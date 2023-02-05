"use strict";

const { TYPE_TOKEN, NAME_META_EXTENDER } = require("../consts");

const path = require("path");
const fs = require("fs");
/**
 * metadata service
 */

module.exports = ({ strapi }) => ({
  async mergeMetadata(contract, tokenId) {
    let result = { attributes: [] };

    const service = strapi.service(TYPE_TOKEN);
    const tokens = await service.find({
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
    const service = strapi.service(TYPE_TOKEN);
    const tokens = await service.find({
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

    const imagePath = path.join(
      __dirname,
      `tokens/${token.contract.slug}/images/${token.tokenId}.png`
    );

    // Check if the file exists
    if (!fs.existsSync(imagePath)) {
      return null;
    }
    return fs.createReadStream(imagePath);
  },
});
