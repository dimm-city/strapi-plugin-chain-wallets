# Chain Wallets Strapi Plugin

A Strapi v4 plugin that allows EVM smart contracts to be easily associated with content-types.

Here are some of the things Chain Wallets currently does:

* [Associate content-types to a smart contracts](docs/contract-content.md)
* Automatically sync tokens to Strapi content types
* Automatically sync token ownership in database
* Associate a tokens with entities
* Automatically configures an API endpoint to return token metadata
* Protects metadata of unminted tokens preventing data leaks
* Allow an initializer function to be specified for each contract
* Configure hooks for your content-type for:
    * Returning metadata
    * Creating new entity for a token
* ...and more to come!

### Roadmap

* Provide "Owns Token" policy to only allow token owners to call the controller action
* Protect images of unminted tokens
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

### Model Lifecycle

If you would like to leverage token metadata when an entity is being created, you can simply use the built in lifecycle hooks of Strapi. For example, this code sets the eyes field to the metadata value from a token when the entity is created:

```javascript
module.exports = {
  async beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    
    //Example of how to do something with the associated token before creating the entity
    const svc = strapi.service("plugin::chain-wallets.chain-token");

    if (data.token.connect.length > 0) {
      const token = await svc.findOne(data.token.connect[0]?.id);

      data.eyes = token.metadata.attributes.find(
        (v) => v.trait_type == "Eyes"
      ).value;
    }
  },
};
```
