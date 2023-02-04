module.exports = {
  syncContracts: {
    task: ({ strapi }) => {
      console.time();
      const service = strapi.service("plugin::chain-wallets.chain-metadata");
      service.syncWallets().then((result) => {
        console.log(JSON.stringify(result));
      });
        console.timeEnd();
    },
    options: {
      rule: "* 1 * * * *",
    },
  },
};
