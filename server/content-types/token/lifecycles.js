const { TYPE_CONTRACT, NAME_ENTITY_INIT } = require("../../consts");

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    if (data.contract.connect.length > 0) {
      const svc = strapi.service(TYPE_CONTRACT);
      const contract = await svc.findOne(data.contract.connect[0]?.id);
      if (contract.entityType) {
        const entitySvc = strapi.services[contract.entityType];

        if (entitySvc) {
          const functionName = contract.entityInitializer ?? NAME_ENTITY_INIT;
          if (entitySvc[functionName] instanceof Function) {
            result = await entitySvc[functionName](data);
          }
        }
      }
    }
  },
};
