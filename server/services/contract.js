const ethers = require("ethers");
const { createCoreService } = require("@strapi/strapi").factories;
const ERC721 = require("../contracts/ERC721.json");
const { TYPE_NETWORK, TYPE_WALLET, TYPE_TOKEN, TYPE_CONTRACT } = require("../consts");
let isSyncing = false;

async function createContractInstance(contract) {
  const provider = new ethers.providers.InfuraProvider(
    contract?.network?.name ?? "homestead",
    process.env.provider_project_id
  );

  // Get the contract object
  const smartContract = new ethers.Contract(
    contract.address,
    contract.abi ?? ERC721,
    provider
  );

  return smartContract;
}
async function updateContractDetails(instance, id, smartContract, currentBlock) {
  const totalSupply = await smartContract.totalSupply();
  await instance.update(id, {
    data: {
      totalSupply: totalSupply,
      lastSynced: currentBlock,
    },
  });
}

module.exports = createCoreService(
  TYPE_CONTRACT,
  ({ strapi }) => ({
    getSmartContract: createContractInstance,
    async importTokens(contract, tokens) {},

    /**
     * Function to check for transactions in multiple ERC-721 contracts and sync chain data to entities
     * @description Used by cron to keep Strapi in sync with on-chain data
     * @returns void
     */
    async syncContracts() {
      if (!isSyncing) {
        isSyncing = true;

        const networkSvc = strapi.service(TYPE_NETWORK);
        const walletSvc = strapi.service(TYPE_WALLET);
        const tokenSvc = strapi.service(TYPE_TOKEN);

        const networks = await networkSvc.find({
          filters: {
            publishedAt: {
              $notNull: true,
            },
          },
          populate: {
            contracts: {
              populate: ["network"],
            },
          },
        });

        let eventCount = 0;
        for (let index = 0; index < networks.results.length; index++) {
          const network = networks.results[index];

          for (const contract of network.contracts) {
            const smartContract = await this.getSmartContract(contract);
            const currentBlock = await smartContract.provider.getBlockNumber();

            // Get the current transaction count for the contract
            const events = await smartContract.queryFilter(
              "Transfer",
              contract.lastSynced ?? 0
            );

            // Check for new events
            for (const event of events) {
              if (event.event == "Transfer" && event.args) {
                // Get the address of the sender and receiver
                const from = event.args.from;
                const to = event.args.to;

                // Get the token ID transferred
                const tokenId = event.args.tokenId.toString();
                let tokens = await tokenSvc.find({
                  filters: { tokenId },
                  populate: "*",
                });
                let token = tokens.results.at(0);
                if (!token) {
                  token = await tokenSvc.create({
                    data: {
                      tokenId,
                      contract,
                    },
                  });
                }

                // Get the sender's wallet
                let senderWallets = await walletSvc.find({
                  filters: { address: from },
                });

                if (senderWallets.results.length < 1) {
                  // Create a new wallet for the sender if it doesn't exist
                  await walletSvc.create({
                    data: { address: from, network, managed: false },
                  });
                }

                // Get the receiver's wallet
                let receiverWallets = await walletSvc.find({
                  filters: { address: to },
                });

                let receiverWallet;
                if (receiverWallets.results.length < 1) {
                  // Create a new wallet for the receiver if it doesn't exist
                  receiverWallet = await walletSvc.create({
                    data: { address: to, network, managed: false },
                  });
                } else receiverWallet = receiverWallets.results.at(0);

                if (token.wallet.id != receiverWallet.id) {
                  // Update the token ownership in the DB
                  await tokenSvc.update(token.id, {
                    data: { wallet: receiverWallet },
                  });
                }
              }
            }
            eventCount += events.length;
            await updateContractDetails(this,
              contract.id,
              smartContract,
              currentBlock
            );
          }
        }
        isSyncing = false;
        return `${networks.results.length} networks synced, ${eventCount} events`;
      } else {
        return "Sync already in progress";
      }
    },
  })
);
