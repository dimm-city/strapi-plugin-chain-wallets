"use strict";

module.exports = {
  default: ({ env }) => ({
    imagePath: env("CW_IMAGE_PATH") ?? ".tokens",
    infuraProjectId: env("infura_project_id") ?? "INFURA PROJECT ID"
  }),
  validator() {},
};
