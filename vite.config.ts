// import { defineConfig } from "vite";
import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";

export default {
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    // globals: true,
    includeSource: ["src/**/*.{js,ts}"],
  },
};
