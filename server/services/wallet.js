const { createCoreService } = require("@strapi/strapi").factories;
const ethers = require("ethers");
const { getNetwork } = require("@ethersproject/networks");
const { TYPE_WALLET } = require("../consts");

module.exports = createCoreService(TYPE_WALLET, (ctx) => ({
  async attachUserWallet(wallet, user) {
    wallet.user = user;
    await super.update(wallet.id, { data: wallet });
  },
  async detachUserWallet(wallet) {
    wallet.user = null;
    await super.update(wallet.id, { data: wallet });
  },
  async createManagedUserWallet(chain, user) {
    const network = getNetwork(chain);
    const wallet = ethers.Wallet.createRandom();

    const walletEntity = await super.create({
      data: {
        managed: true,
        address: wallet.address,
        seed: wallet.mnemonic.phrase,
        key: wallet.privateKey,
        encKey: wallet.privateKey,
        user: user,
        chain: network.name,
      },
    });
    return walletEntity;
  },
  async getOrCreateWallet(chain, address) {
    if (!isNaN(chain)) chain = Number(chain);
    const network = getNetwork(chain);
    const { results } = await super.find({
      filters: {
        address,
        chain: network.name,
      },
      populate: {
        user: true,
      },
    });
    if (results?.length === 1) {
      return results.at(0);
    }
    return await super.create({
      data: {
        address,
        chain: network.name,
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
      fields: ["id", "address", "chain", "name", "managed"],
      populate: {
        tokens: {
          fields: ["id", "tokenId", "metadata"],
          populate: {
            contract: {
              fields: ["id", "name", "slug", "entityType", "address", "chain"],
            },
          },
        },
      },
    });
    return wallets;
  },
}));
