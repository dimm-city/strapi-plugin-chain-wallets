# Chain Wallets Strapi Plugin

A Strapi v4 plugin that allows EVM smart contracts to be easily associated with content-types.

Here are some of the things Chain Wallets currently does:

* Associate content-types to a smart contracts
* Automatically sync tokens to Strapi content types
* Automatically sync token ownership in database
* Associate a tokens with entities
* Automatically configures an API endpoint to return token metadata
* Protects metadata of unminted tokens preventing data leaks
* Configure hooks for your content-type for:
    * Returning metadata
    * Creating new entity for a token
* ...and more to come!

### Roadmap

* Provide "Owns Token" policy to only allow token owners to call the controller action
* Allow an initializer function to be specified for each contract
* Create a "managed wallet" for and associate it with the current user
* Allow users to associate existing wallets with their login
* Import metadata for all tokens in a contract
* Sync common 721 properties to contract entity
* Mint a token from a managed wallet
* Provide factory method to return an initialized EthersJS contract instance from the `plugin::chain-wallets.chain-contract` service

## Configuration

This section gives examples of how to chain wallets' features.
### Extending token metadata

* Assign entity service type to contract
* Optionally specify a function name for the metadata extender function
* Add function to the service that transforms the metadata for the token


