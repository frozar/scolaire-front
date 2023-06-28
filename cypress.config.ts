import { defineConfig } from "cypress";

export default defineConfig({
  // watchForFileChanges: true,
  video: false,
  component: {
    devServer: {
      framework: "@lmiller1990/cypress-ct-solid-js",
      bundler: "vite",
    },
  },
});
