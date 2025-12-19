import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  server: {
    port: 1234,
    host: true,
    allowedHosts: true,
  },
  base: "./",
  build: {
    outDir: "./docs",
  },
  optimizeDeps: {
    include: ["kaplay"],
  },
});
