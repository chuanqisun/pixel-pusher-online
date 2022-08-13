import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  clearScreen: false,
  build: {
    lib: {
      formats: ["es"],
      entry: "src/index.ts",
    },
  },
});
