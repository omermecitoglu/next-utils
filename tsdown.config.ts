import { defineConfig } from "tsdown";

export default defineConfig({
  outDir: "dist",
  entry: [
    "src/**/*.ts",
    "!src/**/*.test.ts",
  ],
  unbundle: true,
});
