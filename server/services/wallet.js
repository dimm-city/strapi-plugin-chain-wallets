const { createCoreService } = require("@strapi/strapi").factories;
const ethers = require("ethers");
const { TYPE_WALLET, TYPE_NETWORK } = require("../consts");

module.exports = createCoreService(TYPE_WALLET, (ctx) => ({
  async attachUserWallet(wallet, user) {
    wallet.user = user;
    await super.update(wallet.id, { data: wallet });
  },
  async detachUserWallet(wallet) {    
    wallet.user = null;
    await super.update(wallet.id, { data: wallet });
  },
  async createManagedUserWallet(networkId, user) {
    const wallet = ethers.Wallet.createRandom();

    const walletEntity = await super.create({
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
    });
    return walletEntity;
  },
  async getOrCreateWallet(networkId, address) {
    const { results } = await super.find({
      filters: {
        address,
        network: {
          chainId: networkId,
        },
      },
      populate:{
        network: true,
        user: true
      }
    });
    if (results?.length === 1) {
      return results.at(0);
    }

    const networkSvc = ctx.strapi.services[TYPE_NETWORK];
    const networks = await networkSvc.find({
      filters: {
        chainId: networkId,
      },
    });
    if (networks.results.length !== 1) {
      strapi.log.warn("Network not found with id: " + networkId);
      return null;
    }
    const network = networks.results.at(0);

    return await super.create({
      data: {
        address,
        network,
        managed: false,
      },
    });
  },
  getSigner(message, signature) {
    const signer = ethers.utils.verifyMessage(message, signature);

    if (!message || !signer) return null;

    return signer;
  },
  async getUserWallets(user) {
    const wallets = await super.find({
      filters: {
        user: { id: user.id },
      },
      fields: ["id", "address", "name", "managed"],
      populate: {
        network: true,
        tokens: {
          fields: ["id", "tokenId", "metadata"],
          populate: {
            contract: {
              fields: ["id", "name", "slug", "entityType", "address"],
            },
          },
        },
      },
    });
    return wallets;
  },
}));
