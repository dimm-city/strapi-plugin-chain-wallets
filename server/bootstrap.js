"use strict";
const cronTasks = require("./config/cron-tasks");
module.exports = ({ strapi }) => {
  // bootstrap phase
  const enableCron = strapi.config.get(
    "plugins.chain-wallets.options.enableCron"
  );
  if (enableCron == true) strapi.cron.add(cronTasks);
};
