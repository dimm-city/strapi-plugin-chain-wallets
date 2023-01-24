# Chain Wallets Strapi Plugin

Chain Wallets is a plugin for Strapi v4 that allows EVM smart contracts to be easily associated with a content-type.

The plugin allows you to:

* Associate content-type to a smart contract
* Configure hooks for your content-type for:
    * Returning metadata
    * Creating new entity for a token
* ...and more ... on the road map

## Configuration

This section gives examples of how to chain wallets' features.
### Extending token metadata

* Assign entity service type to contract
* Optionally specify a function name for the metadata extender function
* Add function to the service that transforms the metadata for the token

## Roadmap
### Completed

* Hook:ExtendMetadata - Allows a contract to specify a function to run to merge token metadata for tokens of that contract

### In progress

* Policy:OwnsToken - Check that the token associated with the current request is owned by the logged in user
* Hook:OnTokenCreated - Allow a contract to specify a function to run when a token is created
* WalletService:createUserWallet - Service method to create a managed wallet and assign it to a user

### Pending

* WalletService:assignUserWallet - Assign a wallet to a user
* ContractService:ImportTokens - Upload the metadata for all tokens for a given contract
* ContractService:updateAttributes - Update contract attributes from blockchain contract
* ContractService:mintToken - Mint a token from a managed wallet
* ContractService:getContractInstance - Return an EthersJS contract instance for a given contract id


