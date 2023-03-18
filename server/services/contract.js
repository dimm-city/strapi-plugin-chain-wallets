const ethers = require("ethers");
const path = require("path");
const fs = require("fs");
const { createCoreService } = require("@strapi/strapi").factories;
const ERC721 = require("../contracts/ERC721.json");
const { TYPE_WALLET, TYPE_TOKEN, TYPE_CONTRACT } = require("../consts");
const unzipper = require("unzipper");

let isSyncing = false;

async function createContractInstance(contract) {
  //ToDo switch to JsonRpcProvider (AVAX) https://docs.infura.io/infura/networks/avalanche-c-chain/how-to/choose-a-network
  const provider = new ethers.providers.InfuraProvider(
    contract.chain ?? "homestead",
    strapi.plugin("chain-wallets").config("infuraProjectId")
  );

  // Get the contract object
  const smartContract = new ethers.Contract(
    contract.address,
    contract.abi ?? ERC721,
    provider
  );

  return smartContract;
}
async function updateContractDetails(id, smartContract, currentBlock) {
  let totalSupply = 0;
  try {
    totalSupply = await smartContract.totalSupply();
  } catch {
    strapi.log.warn(`Could not get total supply for contract: ${id}`);
  }
  await strapi.service(TYPE_CONTRACT).update(id, {
    data: {
      totalSupply: totalSupply,
      lastSynced: currentBlock,
    },
  });
}

async function importTokens(contractId, zipFile) {
  const tokenSvc = strapi.service(TYPE_TOKEN);
  const contracts = await this.find({
    filters: {
      slug: contractId,
    },
  });

  const contract = contracts?.results?.at(0);
  const tempFolderName = "temp-" + Date.now();

  const rootDir = path.resolve(".");
  const tempFolderPath = path.join(rootDir, tempFolderName);
  fs.mkdirSync(tempFolderPath, {
    recursive: true,
  });

  const unzippedFiles = await unzipper.Open.file(zipFile.path);

  // Parse and process each file in the zip archive
  for (const file of unzippedFiles.files) {
    if (file.type === "File" && path.extname(file.path) === ".json") {
      // Parse the contents of the JSON file
      const jsonContent = JSON.parse(await file.buffer());
      const tokenId = path.basename(file.path, path.extname(file.path));

      const tokens = await tokenSvc.find({
        filters: {
          slug: `${contract.slug}-${tokenId}`,
        },
        publicationState: "preview",
      });

      if (tokens?.results?.length === 0) {
        try {
          await tokenSvc.create({
            data: {
              contract,
              tokenId: tokenId,
              slug: `${contract.slug}-${tokenId}`,
              metadata: jsonContent,
              publishedAt: null,
            },
          });
        } catch (error) {
          strapi.log.error("Duplicate token", tokens, error);
        }
      } else {
        await tokenSvc.update(tokens.results.at(0).id, {
          data: {
            metadata: jsonContent,
          },
        });
      }
    } else if (
      file.type === "File" &&
      path.extname(file.path).match(/\.(jpeg|jpg|png|mp4)$/)
    ) {
      const imagePathBase =
        strapi.plugin("chain-wallets").config("imagePath") ?? ".tokens";
      // Save the image file to the server
      const imagePath = path.join(
        imagePathBase,
        `${contract.slug}/${file.path}`
      );
      fs.mkdirSync(path.dirname(imagePath), { recursive: true });
      fs.writeFileSync(imagePath, await file.buffer());
    }
  }

  // Remove the temporary files
  fs.rmSync(tempFolderPath, { recursive: true });
}

function getEntityService(contract) {
  if (contract?.entityType) {
    return strapi.services[contract.entityType];
  }
  return null;
}
async function getTokenEntity(contract, tokenId) {
  const entitySvc = getEntityService(contract);
  if (entitySvc) {
    const x = await entitySvc.find({
      filters: {
        tokenId: `${contract.slug}-${tokenId}`,
      },
      publicationState: "preview",
    });

    if (x.results?.length > 0) return x.results.at(0);
  }

  return null;
}
async function syncContracts() {
  if (!isSyncing) {
    isSyncing = true;

    const contractSvc = strapi.service(TYPE_CONTRACT);

    //ToDo: refactor to query only contracts that are enabled
    const contractResults = await contractSvc.find({
      filters: {
        enableSync: true,
      },
      publicationState: "live",
    });
    const contracts = contractResults.results;

    let eventCount = 0;
    strapi.log.info(`Found ${contracts.length} contracts to sync`);
    for (const contract of contracts) {
      eventCount += await syncContract(contract);
    }

    isSyncing = false;
    return `${contracts.length} synced, ${eventCount} total events`;
  } else {
    return "Sync already in progress";
  }
}
async function syncContract(contract) {
  const walletSvc = strapi.service(TYPE_WALLET);
  const tokenSvc = strapi.service(TYPE_TOKEN);

  const smartContract = await createContractInstance(contract);
  const currentBlock = await smartContract.provider.getBlockNumber();
  const entitySvc = getEntityService(contract);
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
        filters: {
          slug: `${contract.slug}-${tokenId}`,
        },
        populate: "*",
        publicationState: "preview",
      });
      let token = tokens.results.at(0);
      if (!token) {
        token = await tokenSvc.create({
          data: {
            tokenId: `${tokenId}`,
            slug: `${contract.slug}-${tokenId}`,
            contract,
          },
        });
      }

      // Create the sender's wallet if it does not exist
      await walletSvc.getOrCreateWallet(contract.chain, from);

      // Get the receiver's wallet
      let receiverWallet = await walletSvc.getOrCreateWallet(
        contract.chain,
        to
      );

      if (token.wallet?.id != receiverWallet.id) {
        // Update the token ownership in the DB
        await tokenSvc.update(token.id, {
          data: {
            wallet: receiverWallet,
            publishedAt: token.publishedAt ?? new Date().toISOString(),
          },
        });

        if (entitySvc && contract.autoPublishEntity === true) {
          const entity = await getTokenEntity(contract, tokenId);
          if (entity) {
            await entitySvc.update(entity.id, {
              data: {
                token: token,
                publishedAt: token.publishedAt ?? new Date().toISOString(),
              },
            });
          }
        }
      }
    }
  }
  await updateContractDetails(contract.id, smartContract, currentBlock);
  return events.length;
}

module.exports = createCoreService(TYPE_CONTRACT, ({ strapi }) => ({
  getSmartContract: createContractInstance,
  importTokens,
  syncContracts,
  syncContract,
}));
