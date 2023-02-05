"use strict";

const { TYPE_TOKEN, NAME_META_EXTENDER } = require("../consts");


/**
 * metadata service
 */

module.exports = ({ strapi }) => ({
  async mergeMetadata(tokenId, contract) {
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


});
