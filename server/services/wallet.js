const { createCoreService } = require("@strapi/strapi").factories;
const ethers = require("ethers");
const { TYPE_WALLET } = require("../consts");

module.exports = createCoreService(TYPE_WALLET, () => ({
  async attachUserWallet(networkId, address, user) {
    const wallet = await getOrCreateWallet(networkId, address);
    user.wallet = wallet;
    await super.update(user.id, { data: user });
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
    const { results } = super.find({
      filters: {
        address,
        network: {
          chainId: networkId,
        },
      },
    });
    if (results?.length === 1) {
      return results.at(0);
    }

    const networks = await super.find({
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
