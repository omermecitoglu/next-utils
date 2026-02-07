import { defineConfig } from "tsup";

export default defineConfig({
  outDir: "dist",
  entry: [
    "src/**/*.ts",
    "!src/**/*.test.ts",
  ],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  bundle: false,
  clean: true,
  external: [
  ],
  esbuildPlugins: [
  ],
});
