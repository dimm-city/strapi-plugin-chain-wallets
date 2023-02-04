const defaultEntityInitializer = "initializeEntity";
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    if (data.contract.connect.length > 0) {
      const svc = strapi.service("plugin::chain-wallets.chain-contract");
      const contract = await svc.findOne(data.contract.connect[0]?.id);
      if (contract.entityType) {
        const entitySvc = strapi.services[contract.entityType];

        if (entitySvc) {
          const functionName =
            contract.entityInitializer ?? defaultEntityInitializer;
          if (entitySvc[functionName] instanceof Function) {
            result = await entitySvc[functionName](data);
          }
        }
      }
    }
  },
};
