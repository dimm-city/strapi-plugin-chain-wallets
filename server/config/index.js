"use strict";

module.exports = {
  default: ({ env }) => ({
    imagePath: env("CW_IMAGE_PATH") ?? ".tokens",
  }),
  validator() {},
};
