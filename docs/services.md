# Services

## [Contract Service](../server/services/contract.js)

* WalletService:createUserWallet
* ContractService:getContractInstance - Return an EthersJS contract instance for a given contract id
* ContractService:importTokens - Upload the metadata for all tokens for a given contract by uploading a zip file containing all of the metadata in JSON files. You may optionally include the images in the zip file as well. The plugin will extract the images to the .tokens folder in a subfolder for the related contract. This is the default location the metadata service will serve images from unless overridden in the `metadataExtender` hook.


## [Token Service](../server/services/token.js)

* 

## [Wallet Service](../server/services/wallet.js)

* createUserWallet - Service method to create a managed wallet and assign it to a user
* attachUserWallet