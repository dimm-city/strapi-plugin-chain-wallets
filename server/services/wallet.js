const { createCoreService } = require("@strapi/strapi").factories;
const ethers = require("ethers");
const { TYPE_WALLET } = require("../consts");


module.exports = createCoreService(
  TYPE_WALLET,
  () => ({
    async attachUserWallet(wallet, user) {
      console.warn("Not Implemented");
    },
    async createUserWallet(networkId, user) {
      const wallet = ethers.Wallet.createRandom();

      const walletEntity = await super.create(
        {
          data: {
            managed: true,
            address: wallet.address,
            seed: wallet.mnemonic.phrase,
            key: wallet.privateKey,
            encKey: wallet.privateKey,
            user: user,
            blockchain: {
              id: networkId,
            },
          },
        }
      );
      return walletEntity;
    },
  })
);
