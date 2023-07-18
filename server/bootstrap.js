"use strict";
const cronTasks = require("./config/cron-tasks");
module.exports = ({ strapi }) => {
  // bootstrap phase
  if (strapi.plugin("chain-wallets").config("enableCron") !== false)
    strapi.cron.add(cronTasks);
};
