# Chain Wallets Strapi Plugin

A Strapi v4 plugin that allows EVM smart contracts to be easily associated with content-types.

Here are some of the things Chain Wallets currently does:

- [Associate content-types to a smart contracts](docs/contracts-content.md)
- [Associate a tokens with entities](docs/contracts-content.md)
- [Automatically sync tokens to Strapi content types](docs/syncing-tokens.md)
- [Automatically sync token ownership in database](docs/syncing-tokens.md)
- [Automatically configures an API endpoint to return token metadata](docs/metadata-api.md)
- [Protects metadata of unminted tokens preventing data leaks](docs/metadata-api.md)
- [Protect your routes with 'token-exists' and 'owns-token' policies](docs/policies.md)
- [Extend entity service with to integrate with token metadata](docs/hooks.md#service-functions)
  - [Allow an initializer function to be specified for each contract](docs/hooks.md#initializeEntity)
  - [Extend token metadata from entity](docs/hooks.md#extendtokenmetadata)
- [Configure hooks for your content-type for:](docs/hooks.md#model-lifecycle)
  - [Creating new entity from token metadata](docs/hooks.md#beforecreate)
- [...and more to come!](docs/TODO.md)

### Roadmap

- Provide "Owns Token" policy to only allow token owners to call the controller action
- Protect images of unminted tokens
- Create a "managed wallet" for and associate it with the current user
- Allow users to associate existing wallets with their login
- Import metadata for all tokens in a contract
- Sync common 721 properties to contract entity
- Mint a token from a managed wallet
- Provide factory method to return an initialized EthersJS contract instance from the `plugin::chain-wallets.chain-contract` service

## Configuration

This section gives examples of how to chain wallets' features.

### Extending token metadata

- Assign entity service type to contract
- Optionally specify a function name for the metadata extender function
- Add function to the service that transforms the metadata for the token
