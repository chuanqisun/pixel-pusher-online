import preact from "@preact/preset-vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  clearScreen: false,
  base: "",
  plugins: [preact()],
  server: {
    open: "/debug.html",
  },
});
