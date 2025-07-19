import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": __dirname,
    },
  },
});
