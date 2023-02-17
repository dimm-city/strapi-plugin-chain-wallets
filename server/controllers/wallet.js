const { TYPE_WALLET } = require("../consts");

async function attachUserWallet(ctx) {
    try {
        if (ctx.state.user?.id == null)
            throw new Error("You must be logged in to attach a wallet to your account.");
        const { network } = ctx.params;

        const signature = ctx.header.authorization;
        const service = strapi.service(TYPE_WALLET);
        const message = service.getVerificationMessage();
        let address = service.getSigner(message, signature);
        let result = {
            error: "Failed to attach wallet."
        };
        if (address)
            result = await service.attachUserWallet(network, address, ctx.state.user);

        ctx.body = result;
    } catch (error) {
        ctx.body = error;
        ctx.response.status = 500;
        strapi.log.error(error);
    }
}

function getVerificationMessage() {
    //TODO: pull from plugin settings
    return "Sign this message to verify wallet ownership.";
}

module.exports = {
    attachUserWallet,
    getVerificationMessage
};
