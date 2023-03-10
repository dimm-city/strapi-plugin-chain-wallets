const { TYPE_CONTRACT, NAME_ENTITY_INIT } = require("../../consts");

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    //ToDo: refactor to only query if contract is null

    if (data?.contract?.id || data?.contract?.connect?.length > 0) {
      const svc = strapi.service(TYPE_CONTRACT);
      const contract = await svc.findOne(
        data?.contract?.id ?? data.contract.connect[0]?.id
      );
      if (contract?.slug && !data.slug?.startsWith(contract.slug)) {
        data.slug = `${contract.slug}-${data.tokenId}`;
      }
    }
  },
  async afterCreate(event) {
    const { result } = event;
    const { data } = event.params;

    if (data?.contract?.id || data?.contract?.connect?.length > 0) {
      const svc = strapi.service(TYPE_CONTRACT);

      //ToDo: refactor to only query if contract is null
      const contract = await svc.findOne(
        data?.contract?.id ?? data.contract.connect[0]?.id
      );
      if (contract?.entityType) {
        const entitySvc = strapi.services[contract.entityType];

        if (entitySvc) {
          const functionName = contract.entityInitializer ?? NAME_ENTITY_INIT;
          if (entitySvc[functionName] instanceof Function) {
            await entitySvc[functionName](result);
          } else {
            const entity = await entitySvc.find({
              filters: {
                tokenId: result.slug,
              },
            });

            if (entity?.results?.length === 0) {
              //Do default init, parse properties of metadata and attempt to map them to entity properties
              await strapi.entityService.create(contract.entityType, {
                data: {
                  name: result.metadata?.name,
                  tokenId: result.slug,
                  token: result,
                },
              });
            } else if (entity?.results?.length === 1) {
              const id = entity?.results[0].id;

              await strapi.entityService.update(contract.entityType, id, {
                data: {
                  token: result,
                },
              });
            }
          }
        }
      }
    }
  },
};
