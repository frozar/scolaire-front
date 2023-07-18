import { defineConfig } from "cypress";

import getCompareSnapshotsPlugin from "cypress-image-diff-js/dist/plugin";

export default defineConfig({
  // watchForFileChanges: true,
  video: false,
  component: {
    // viewportWidth: 1000,
    // viewportHeight: 1080,
    devServer: {
      framework: "@lmiller1990/cypress-ct-solid-js",
      bundler: "vite",
    },
    setupNodeEvents(on, config) {
      on("task", {
        // In the test file in the it callback use it like
        // cy.task('log', msg)
        log(message) {
          console.log(message);
          return null;
        },
      });

      getCompareSnapshotsPlugin(on, config, {
        rootDir: "cypress/",
      });
      // getCompareSnapshotsPlugin(on, config, { rootDir: "./cypress" });
    },
  },
});
