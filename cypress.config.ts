import { defineConfig } from "cypress";

import getCompareSnapshotsPlugin from "cypress-image-diff-js/dist/plugin";

export default defineConfig({
  // watchForFileChanges: true,
  video: false,
  component: {
    devServer: {
      framework: "@lmiller1990/cypress-ct-solid-js",
      bundler: "vite",
    },
    setupNodeEvents(on, config) {
      getCompareSnapshotsPlugin(on, config, {
        rootDir: "cypress/",
      });
    },
  },
});
